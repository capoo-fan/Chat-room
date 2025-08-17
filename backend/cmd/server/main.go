package main

import (
	"log"
	"net/http"
	"github.com/gin-gonic/gin"
)

func main() {
	// 创建一个 Gin 路由器
	r := gin.Default()

	// 设置一个简单的 /ping 路由用于测试
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	port := "8080" // 暂时硬编码端口
	log.Printf("服务器正在启动，监听端口 %s", port)

	// 启动服务器
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
	}
}