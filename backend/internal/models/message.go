package models

import "gorm.io/gorm"

type Message struct {
	gorm.Model
	Text     string
	UserID   uint
	Username string
}
