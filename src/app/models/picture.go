package models

import (
  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/mysql"
	"time"
)

var db *gorm.DB

func init() {
  conn, err := gorm.Open("mysql", "root@tcp(127.0.0.1:3306)/ar_maker?charset=utf8&parseTime=True&loc=Local")
  if err != nil {
    panic(err)
  }
  db = conn
  //DB Migrate
  if !db.HasTable("pictures") {
    db.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(&Picture{})
  }
}

type Picture struct {
  Id int64
  Filename string `sql:"size:255"`
  Uid string `sql:"size:255"`
  UserUid string `sql:"size:255"`
  CreatedAt time.Time
  UpdatedAT time.Time
}
