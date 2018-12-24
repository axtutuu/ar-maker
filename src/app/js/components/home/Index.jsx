import React from 'react'
import Base from '../Base.jsx'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../../actions'

class HomeIndex extends Base {
  constructor(props) {
    super(props)
    this.tracker = new tracking.ObjectTracker('face')
    this.rect = {}
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const context = canvas.getContext('2d')

    this.tracker.setInitialScale(4)
    this.tracker.setStepSize(2)
    this.tracker.setEdgesDensity(0.1)
    this.trackTask = tracking.track('#video', this.tracker, { camera: true })

    this.tracker.on('track', (e) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      e.data.forEach((rect) => {
        context.strokeStyle = '#a64ceb';
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        this.rect = rect
      })
    })
  }

  next() {
    this.trackTask.stop()
    const c = document.createElement('canvas')
    const x = c.getContext('2d')
    c.width = 512
    c.height = 512
    x.clearRect(0, 0, c.width, c.height);
    x.drawImage(video, this.rect.x+this.rect.width, this.rect.y+this.rect.height, this.rect.width*2, this.rect.height*2, 0, 125, 250, 250)
    this.props.setImage(c.toDataURL('image/png'))

    this.props.history.push('/home/confirm')
  }

  render() {
    return(
      <div className="picture">
        <video id="video" className="picture__video" width="320" height="240" ref="video" preload autoPlay loop muted></video>
        <canvas id="canvas" className="picture__canvas" width="320" height="240" ref="canvas"></canvas>

        <button onClick={this.next.bind(this)}to='/home/confirm' style={{ zIndex: 1000, position: 'relative' }}>Next</button>
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
)(HomeIndex);
