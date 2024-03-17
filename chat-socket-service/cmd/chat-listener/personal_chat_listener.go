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

type personalChatListener struct {
	chatMgmtSvc http.Client
}

func NewPersonalChatListener(svc http.Client) personalChatListener {
	return personalChatListener{chatMgmtSvc: svc}
}
func (p personalChatListener) Listen(rdb *redis.Client) error {
	ctx := context.Background()
	pubsub := rdb.PSubscribe(ctx, "personal.*")
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

		if m.ReceiverId == "" {
			continue
		}

		if err := p.PersistMessage(m); err != nil {
			log.Print(err)
			return err
		}

	}
}

func (p personalChatListener) PersistMessage(m models.Message) error {
	b, _ := json.Marshal(m)
	buf := bytes.NewBuffer(b)

	res, err := p.chatMgmtSvc.Post(os.Getenv("CHAT_MANAGEMENT_SERVICE_URL")+"/personal-chat/message", "application/json", buf)
	if err != nil {
		return err
	}

	if res.StatusCode > 299 || res.StatusCode < 200 {
		return errors.New("Unable to persist message")
	}

	return nil
}
