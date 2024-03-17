package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/meta-chat/chat-socket-service/models"
	"github.com/redis/go-redis/v9"
)

type ChatHandler struct {
	upgrader          websocket.Upgrader
	rdb               *redis.Client
	chatManagementSvc http.Client
}

func NewChatHandler(upgrader websocket.Upgrader,
	redisClient *redis.Client, svc http.Client) ChatHandler {
	return ChatHandler{upgrader: upgrader,
		rdb:               redisClient,
		chatManagementSvc: svc}
}

func (c ChatHandler) Handle(ctx *gin.Context) {
	conn, err := c.upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, err)
		return
	}

	userId := ctx.Param("userId")
	c.SetupConnections(conn, userId)

}

func (c ChatHandler) SetupConnections(conn *websocket.Conn, userId string) {
	// read from the user - publish to redis
	go func() {
		for {
			_, data, err := conn.ReadMessage()
			if err != nil {
				log.Fatal(err)
				return
			}
			m := models.Message{}
			json.Unmarshal(data, &m)

			fmt.Println(m)
			// handle group msg / personal msg
			if m.GroupId != "" {
				channel := "groups." + m.GroupId
				c.rdb.Publish(context.Background(), channel, data)
			} else {
				channel := "personal." + m.ReceiverId
				c.rdb.Publish(context.Background(), channel, data)
			}
		}
	}()

	// subscribe from redis - write to the user
	// group chats and personal chat
	groupIds, _ := c.getUserGroupIds(userId)
	channelIds := []string{}
	for i := range groupIds {
		channelIds = append(channelIds, "groups."+groupIds[i])
	}

	channelIds = append(channelIds, "personal."+userId)
	go func() {

		subscriber := c.rdb.Subscribe(context.Background(), channelIds...)
		for {
			data, err := subscriber.Receive(context.Background())
			if err != nil {
				log.Print(err)
				return
			}

			b, _ := json.Marshal(data)
			err = conn.WriteMessage(websocket.BinaryMessage, b)
			if err != nil {
				log.Print(err)
				return
			}

		}
	}()

}

func (c ChatHandler) getUserGroupIds(userId string) ([]string, error) {
	res, err := c.chatManagementSvc.Get(os.Getenv("CHAT_MANAGEMENT_SERVICE_URL") + fmt.Sprintf("/group-chat/user-groups/%s",
		userId))
	if err != nil {
		return nil, err
	}

	if res.StatusCode > 299 || res.StatusCode < 200 {
		return nil, errors.New("Unable to fetch user groups")
	}

	body, _ := io.ReadAll(res.Body)
	groupIds := []string{}
	_ = json.Unmarshal(body, &groupIds)

	return groupIds, nil

}
