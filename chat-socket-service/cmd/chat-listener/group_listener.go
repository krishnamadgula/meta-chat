package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/meta-chat/chat-socket-service/models"
	"github.com/redis/go-redis/v9"
)

type groupListener struct {
	chatMgmtSvc http.Client
}

func NewGroupListener(svc http.Client) groupListener {
	return groupListener{chatMgmtSvc: svc}
}
func (g groupListener) Listen(rdb *redis.Client) error {
	ctx := context.Background()
	pubsub := rdb.PSubscribe(ctx, "groups.*")
	defer pubsub.Close()
	var m models.Message
	for {
		msg, err := pubsub.ReceiveMessage(ctx)
		if err != nil {
			return err
		}

		// b, _ := json.Marshal(data)
		// groupId := strings.TrimPrefix(msg.Channel, "groups.")
		fmt.Println("listener msg received: ", msg.Payload)
		b := []byte(msg.Payload)
		if err = json.Unmarshal(b, &m); err != nil {
			return err
		}

		if m.GroupId == "" {
			continue
		}

		if err := g.PersistMessage(m); err != nil {
			log.Print(err)
			return err
		}

	}
}

func (g groupListener) PersistMessage(m models.Message) error {
	b, _ := json.Marshal(m)
	buf := bytes.NewBuffer(b)

	res, err := g.chatMgmtSvc.Post(os.Getenv("CHAT_MANAGEMENT_SERVICE_URL")+fmt.Sprintf("/group-chat/%s/message",
		m.GroupId), "application/json", buf)
	if err != nil {
		return err
	}

	if res.StatusCode > 299 || res.StatusCode < 200 {
		return errors.New("Unable to persist message")
	}

	return nil
}
