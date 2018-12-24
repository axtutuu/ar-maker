import React from 'react'
import Base from '../Base.jsx'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { dataURIToBlob } from '../../modules/image'
import $ from 'jquery'

class HomeConfirm extends Base {
  constructor(props) {
    super(props)

    // if (!this.props.image) {
    //   this.props.history.push('/')
    // }
  }

  componentDidMount() {
    const image = new Image()
    this.canvas = this.refs.canvas
    this.cxt = this.canvas.getContext('2d')
    // image.src = this.props.image
    image.src = '/public/uploads/3w4cptmwkgnpa-1521290614048161785.png' 
    image.onload = () => {
      this.canvas.width = image.width
      this.canvas.height = image.height
      this.cxt.drawImage(image, 0, 0)
      this.canvasSetting()
    }
  }

  canvasSetting() {
    this.x = 0
    this.y = 0
    this.startX = 0
    this.startY = 0
    this.isPaint = false

    console.log(this.canvas)
    this.cxt.strokeStyle = '#000000'
    this.cxt.lineWidth = 5
    this.cxt.lineJoin = 'round'
    this.cxt.lineCap = 'round'

    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this))
  }

  componentWillUnmount() {
    this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this))
    this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this))
    this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this))
  }

  onMouseDown(e) {
    this.startX = e.clientX - e.target.getBoundingClientRect().left
    this.startY = e.clientY - e.target.getBoundingClientRect().top
    this.isPaint = true
    console.log(this.startX, this.startY, e.target.getBoundingClientRect().left)
  }

  onMouseMove(e) {
    if (!this.isPaint) return

    this.x = event.clientX-event.target.getBoundingClientRect().left
    this.y = event.clientY-event.target.getBoundingClientRect().top
    this.drawLine()
    this.startX = this.x
    this.startY = this.y
  }

  onMouseUp() {
    this.isPaint = false
  }

  drawLine() {
    this.cxt.beginPath()
    this.cxt.moveTo(this.startX, this.startY)
    this.cxt.lineTo(this.x, this.y)
    this.cxt.stroke()
  }

  submit() {
    const base64 = this.canvas.toDataURL('image/png')
    const blob = dataURIToBlob(base64)
    const data = new FormData()
    data.append('image', blob, 'blob.png')
    $.ajax({
        url: `/upload`,
        type: 'POST',
        processData: false,
        contentType: false,
        data,
    }).done((res) => {
        this.props.setImage(res.file)
        this.props.history.push(`/avatar/${res.uid}`)
    })
  }

  render() {
    return(
      <div className="confirm">
        <canvas ref="canvas"></canvas>
        <img src={this.props.image}></img>
        <button onClick={ this.submit.bind(this) }>submit</button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    image: state.user.image
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setImage: (image) => dispatch(actions.setImage(image)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeConfirm);
