package controllers

import (
    "models"
)

// idに合致する記事の情報を返す
func (c User) GetId(n int) interface{} {
    repo := models.NewUserRepository()
    post := repo.GetByUserID(n)
    return post
}
