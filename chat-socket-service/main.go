package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/meta-chat/chat-socket-service/handlers"
	"github.com/redis/go-redis/v9"
)

func main() {
	e := gin.New()

	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	svc := http.Client{}
	ch := handlers.NewChatHandler(upgrader, rdb, svc)
	e.GET("/chat/:userId", ch.Handle)

	if err := e.Run(":8080"); err != nil {
		log.Fatal("couldn't start server")
	}
}
