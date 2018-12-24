package mysql

import (
  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/mysql"
)

func mysql() {
  db, err := gorm.Open("mysql", "root@/ar-maker?charset=utf8&parseTime=True&loc=Local")
  defer db.Close()
}
