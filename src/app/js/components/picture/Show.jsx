import React from 'react'
import Base from '../Base.jsx'

export default class PictureShow extends Base {
  constructor(props) {
    super(props)
  }

  render() {
    const { params } = this.props.match
    return(
      <div className="container">
        <img src={ `/public/uploads/pictures/${params.uid}.png` }/>
      </div>
    )
  }
}
