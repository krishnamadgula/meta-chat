package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/redis/go-redis/v9"
)

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	personalChatListener := NewPersonalChatListener(http.Client{})
	groupChatListener := NewGroupListener(http.Client{})
	errCh := make(chan error)
	wg := sync.WaitGroup{}
	wg.Add(1)

	go func(wg *sync.WaitGroup) {
		// group msg listener
		defer wg.Done()
		errCh <- groupChatListener.Listen(rdb)

	}(&wg)

	wg.Add(1)

	go func(wg *sync.WaitGroup) {
		// personal msg listener
		defer wg.Done()
		errCh <- personalChatListener.Listen(rdb)
	}(&wg)

	if err := <-errCh; err != nil {
		log.Fatal(err)

	}

	defer wg.Wait()

}
