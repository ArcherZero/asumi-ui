/**
 * Created by elly on 16/9/19.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {contains, addEvent, removeEvent, noop} from '../util';

export default class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {toggle: false, className: ''}
    }

    componentDidMount() {
        this.getClassName();
        addEvent(window, 'click', this.clickToClose.bind(this));
        addEvent(window, 'resize', this.getClassName.bind(this));
    }

    componentWillUnmount() {
        removeEvent(window, 'click', this.clickToClose.bind(this));
        removeEvent(window, 'resize', this.getClassName.bind(this));
    }

    componentWillReceiveProps() {
        if (this.state.toggle) {
            this.setState(old => {
                old.toggle = false;
                return old;
            })
        }
    }

    getClassName() {
        let className = '';
        if (this._dropdown && this._dropdown_menu && this._dropdown.getBoundingClientRect) {
            let {bottom, top} = this._dropdown.getBoundingClientRect();
            if (bottom < (top + (document.body.scrollTop || document.documentElement.scrollTop))) {
                className = 'el-dropdown-menu-bottom';
            }
        }
        this.setState({className});
    }

    handleToggle() {
        this.setState(old => {
            old.toggle = !old.toggle;
            return old;
        })
    }

    clickToClose(e) {
        const target = this._dropdown;
        if (target && !contains(target, e.target)) {
            this.setState(old => {
                old.toggle = false;
                return old;
            })
        }
    }

    render() {
        const {list, type, style, children, onClick} = this.props;
        let className = classnames({
            'el-btn': true,
            'el-dropdown-toggle': true,
            'el-danger': type === 'danger',
            'el-success': type === 'success',
            'el-primary': type === 'primary',
            'el-secondary': type === 'secondary',
        });
        return (
            <div className="el-dropdown" style={style} ref={(c) => {
                this._dropdown = c
            }}>
                <button
                    type="button"
                    className={className}
                    onClick={this.handleToggle.bind(this)}>
                    {children}
                    <span
                        className="el-caret"
                        style={this.state.toggle ? {borderTop: 0, borderBottom: '4px solid'} : null}/>
                </button>
                <ul className={"el-dropdown-menu " + this.state.className} ref={(c) => {
                    this._dropdown_menu = c
                }} style={{display: this.state.toggle && 'block' || null}}>
                    {
                        list.map((item, index) => {
                            return (
                                <li key={index}>
                                    <a href={item.href || 'javascript:;'}
                                       onClick={(e) => {
                                           if (!item.href) {
                                               e.preventDefault();
                                           }
                                           onClick(item)
                                       }}>{item.label || item}</a>
                                </li>);
                        })
                    }
                </ul>
            </div>
        )
    }
}

Dropdown.propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['default', 'danger', 'success', 'primary', 'secondary']),
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.shape({
        href: PropTypes.string,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node, PropTypes.func, PropTypes.element])
    })])

};
Dropdown.defaultProps = {
    type: 'default',
    onClick: noop
};