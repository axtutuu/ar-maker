package models

import (
  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/mysql"
	"time"
)

func init() {
  conn, err := gorm.Open("mysql", "root@tcp(127.0.0.1:3306)/ar_maker?charset=utf8&parseTime=True&loc=Local")
  if err != nil {
    panic(err)
  }
  db = conn
  //DB Migrate
  if !db.HasTable("users") {
    db.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(&User{})
  }
}

type User struct {
  Id int64
  Filename string `sql:"size:255"`
  Uid string `sql:"size:255"`
  CreatedAt time.Time
  UpdatedAT time.Time
}

// Repository
type UserRepository struct {
}

// Repositoryを返す
func NewUserRepository() UserRepository {
  return UserRepository{}
}

// idに合致する記事を取得
func (m UserRepository) GetByUserID(id int64) *User {
	var user User
	db.Where(User{Id: id}).Find(&user)
	return &user
}
