package main

import (
  "github.com/jinzhu/gorm"
  _ "github.com/go-sql-driver/mysql"
  "app/models"
)

func main(){
  db, _ := gorm.Open("mysql", "root@/ar_maker?charset=utf8&parseTime=True&loc=Local")
  db.CreateTable(&models.User{})
}
