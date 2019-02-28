import React from "react"
import { connect } from "dva"
import listen, { debounce } from "tiny-listen"
import styles from "./IndexPage.css"

class Home extends React.Component {
  static dom = null
  componentWillunmount() {
    if (this.a) {
      this.a.destroy()
    }
  }
  componentDidMount() {
    const dom = this.dom

    this.a = listen(
      dom,
      "click",
      debounce(
        e => {
          console.log(123)
        },
        1000,
        { leading: true, trailing: true, maxWait: 200 }
      )
    )
  }

  render() {
    return (
      <div
        ref={e => {
          this.dom = e
        }}
        className={styles.normal}
      >
        <div style={{ height: "722px" }} />
        <ul className={styles.list}>
          <li>
            To get started, edit <code>src/index.js</code> and save to reload.
          </li>
          <li>
            <a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">
              Getting Started
            </a>
          </li>
        </ul>
      </div>
    )
  }
}

Home.propTypes = {}

export default connect()(Home)
