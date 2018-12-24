package main

import (
  "app/models"
	"github.com/gin-gonic/gin"
	"html/template"
  "os"
  "io"
  "log"
  "strconv"
  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/mysql"
  "time"
  "encoding/binary"
  "crypto/rand"
)

var server *gin.Engine
var templates map[string]*template.Template

func init() {
	loadTemplates()
}

func main() {

  server = gin.Default()
  server.Static("/public/css/", "./public/css")
  server.Static("/public/js/", "./public/js")
  server.Static("/public/images/", "./public/images")
  server.Static("/public/uploads/", "./public/uploads")

  server.GET("/", IndexRouter)
  server.GET("/home/confirm", IndexRouter)
  server.GET("/avatar/:id", AvatarShow)
  server.GET("/pictures/:id", AvatarShow)
  server.POST("/upload", UploadRouter)
  server.POST("/users/picture", UserPictureRouter)

  port := os.Getenv("PORT")
  if len(port) == 0 {
    port = "3000"
  }
  server.Run(":" + port)
}

func IndexRouter(g *gin.Context) {
  server.SetHTMLTemplate(templates["index"])
  g.HTML(200, "_base.html", nil)
}

func UploadRouter(g *gin.Context) {
  db := connection()
  var uid = random()
  var user = &models.User{Filename : uid + ".png", Uid: uid}
  db.Create(&user)

  file, _ , err := g.Request.FormFile("image")
  out, err := os.Create("./public/uploads/"+uid+".png")
  if err != nil {
    log.Fatal(err)
  }

  _, err = io.Copy(out, file)
  if err != nil {
    log.Fatal(err)
  }

  g.JSON(200, gin.H{
      "id": user.Id,
      "uid": user.Uid,
      "file": user.Filename,
  },)
}

func UserPictureRouter(g *gin.Context) {
  db := connection()
  var uid = random()
  var userUid = g.PostForm("user_uid")
  var picture = &models.Picture{Filename : uid + ".png", Uid: uid, UserUid: userUid }
  db.Create(&picture)

  file, _ , err := g.Request.FormFile("image")
  out, err := os.Create("./public/uploads/pictures/"+ uid +".png")
  if err != nil {
    log.Fatal(err)
  }

  _, err = io.Copy(out, file)
  if err != nil {
    log.Fatal(err)
  }

  g.JSON(200, gin.H{
      "id": picture.Id,
      "uid": picture.Uid,
      "user_uid": picture.UserUid,
      "file": picture.Filename,
  },)
}

func AvatarShow(g *gin.Context) {
  server.SetHTMLTemplate(templates["index"])
  // g.HTML(200, "_base.html", gin.H{
  //   "user": user,
  // })
  g.HTML(200, "_base.html", nil)
}

func loadTemplates() {
	var baseTemplate = "templates/layout/_base.html"
	templates = make(map[string]*template.Template)

	templates["index"] = template.Must(template.ParseFiles(baseTemplate, "templates/home/index.html",))
	templates["usersShow"] = template.Must(template.ParseFiles(baseTemplate, "templates/users/show.html",))
}

func connection() *gorm.DB {
  db, err := gorm.Open("mysql", "root@tcp(127.0.0.1:3306)/ar_maker?charset=utf8&parseTime=True&loc=Local")

  if err != nil {
    log.Fatal(err)
  }

  return db
}

func random() string {
    var tn = strconv.FormatInt(time.Now().UnixNano(), 10)
    var n uint64
    binary.Read(rand.Reader, binary.LittleEndian, &n)
    var s = strconv.FormatUint(n, 36)
    return s + "-" + tn
}
