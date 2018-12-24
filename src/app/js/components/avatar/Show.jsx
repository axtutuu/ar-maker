import React from 'react'
import Base from '../Base.jsx'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import three from '../../modules/three'
import { dataURIToBlob } from '../../modules/image'
import $ from 'jquery'

class AvatarShow extends Base {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { params } = this.props.match
    three(`/public/uploads/${params.uid}.png`)
  }

  take() {
    const { params } = this.props.match
    const c = document.createElement('canvas')
    const video = document.querySelector('video')
    const canvas = document.querySelector('canvas')
    const x = c.getContext('2d')
    c.width = video.clientWidth
    c.height = video.clientHeight
    x.drawImage(video, 0, 0, video.clientWidth, video.clientHeight)
    x.drawImage(canvas, 0, 0, video.clientWidth, video.clientHeight)

    const base64 = c.toDataURL('image/png')
    const blob = dataURIToBlob(base64)
    const data = new FormData()
    data.append('image', blob)
    data.append('user_uid', params.uid)
    $.ajax({
        url: `/users/picture`,
        type: 'POST',
        processData: false,
        contentType: false,
        data,
    }).done((res) => {
        this.props.history.push(`/pictures/${res.uid}`)
    })
  }

  render() {
    return(
      <div className="container">
        <div className="ar"></div>
        <button className="container__button" onClick={ this.take.bind(this) }>Take</button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    image: state.user.image
  }
}

export default connect(
  mapStateToProps,
)(AvatarShow);
