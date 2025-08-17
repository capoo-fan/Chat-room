package models

import (
	"log"
	"github.com/capoo-fan/chat-room/backend/internal/config"
	
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"	
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	dbPath := config.AppConfig.Database.Path
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("无法连接到数据库: %v", err)
	}
	log.Println("数据库连接成功。")
	err = DB.AutoMigrate(&models.User{}, &models.Message{})
	if err != nil {
		log.Fatalf("无法迁移数据库: %v", err)
	}
	log.Println("数据库迁移成功。")
}