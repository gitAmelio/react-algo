import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { pageChange } from '../actions'

export class Links extends Component {
    
    style = {
        fontFamily: 'sans',
        fontSize: '1.2rem',
        textDecoration: 'none',
        padding: '2px 8px',
        
    } 

    linkStyle = (pageName) => {
        if(this.props.pageName === pageName){
            return { ...this.style, borderBottomColor: '#3bba9c' }
        }
        return this.style
    }

    cssClass = (pageName) => {
        if(this.props.pageName === pageName){
            return 'nav-link-focus'
        }
        return 'nav-link'
    }

    handleLink = (e) => {
        this.props.pageChange(e.currentTarget.text)
    }

    render() {
        return (
            <div className="nav">
                {/* <Link  onClick={this.handleLink} className="nav-link" style={this.linkStyle('Stack LinkList')}  to="/node_link"> */}
                <Link  onClick={this.handleLink} className={this.cssClass('Stack LinkList')}  to="/node_link">
                    {/* <i className="sign out icon" /> */}
                        Stack LinkList
                </Link>
                {/* <Link  onClick={this.handleLink} className="nav-link" style={this.linkStyle('AVL Tree')}  to="/avl_tree"> */}
                <Link  onClick={this.handleLink} className={this.cssClass('AVL Tree')} to="/avl_tree">
                    {/* <i className="sign out icon" /> */}
                        AVL Tree
                </Link>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {pageName: state.page.name};
}

export default connect(
    mapStateToProps, 
    {pageChange}
)(Links)

