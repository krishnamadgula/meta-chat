package models

type Message struct {
	GroupId    string `json:"groupId"`
	SenderId   string `json:"senderId"`
	ReceiverId string `json:"receiverId"`
	Message    string `json:"message"`
}
