/**
 * Created by elly on 2017/4/8.
 */
import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Input from '../input';
import Option from './option';
import {isArr, extend, contains, addEvent, removeEvent, KeyCode} from '../util';


export default class Select extends Component {
    constructor(props) {
        super(props);
        this.index = -1;
        this.state = {
            data: [],
            focus: false,
            allValue: [],
            visible: false,
            searchValue: '',
            renderValue: '',
            selectedValue: [],
            selectedLabel: []
        }
    }

    componentWillMount() {
        this.getData(this.props);
    }

    componentDidMount() {
        addEvent(window, 'resize', this.addStyle.bind(this));
        addEvent(document, 'click', this.handleClose.bind(this));
    }

    componentWillUnmount() {
        if (this.container) {
            document.body.removeChild(this.container);
            this.container = null;
        }
        removeEvent(window, 'resize', this.addStyle.bind(this));
        removeEvent(document, 'click', this.handleClose.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        this.getData(nextProps);
    }

    setPreSelect(length, minus) {
        if (minus) {
            if (this.index === 0) {
                this.index = length
            }
            this.index--;
        } else {
            if (this.index === length - 1) {
                this.index = -1
            }
            this.index++;
        }
    }

    getData(props) {
        let data = [], renderData = [], allValue = [], selectedLabel = [], selectedValue = [];
        let {value, defaultValue, children} = props;
        value = isArr(value) ? value : ( !value && value != '0' ? [] : [value]);
        defaultValue = isArr(defaultValue) ? defaultValue : ( !defaultValue && defaultValue != '0' ? [] : [defaultValue]);
        selectedValue = value.length ? value : defaultValue;
        if (children) {
            React.Children.map(children, (elm) => {
                if (!elm) return;
                let {value, disabled, label, children} = elm.props;
                let index = selectedValue.indexOf(value);
                allValue.push(value);
                if (~index) {
                    selectedLabel[index] = children || label;
                }
                data.push({value, disabled, label: children || label});
                renderData.push({value, disabled, label: children || label});
            });
        }
        this.setState({
            data,
            allValue,
            renderData,
            selectedValue,
            selectedLabel,
            renderValue: selectedLabel.join(", ")
        });
    }

    getPosition() {
        if (!this.container) return;
        let {clientHeight} = this.container;
        let {top, left, bottom, width} = this.el_select.getBoundingClientRect();
        let scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        top += scrollTop;
        left += scrollLeft;
        bottom += scrollTop;
        let leftHeight = Math.max(window.innerHeight, document.body.clientHeight);
        let leftTopHeight = leftHeight - top;
        let leftBottomHeight = leftHeight - bottom;
        this.style = {
            width: width + 'px',
            top: bottom + 'px',
            left: left + 'px'
        };
        if (clientHeight > leftTopHeight && clientHeight > leftBottomHeight && leftBottomHeight < leftTopHeight) {
            this.style.top = top - clientHeight + 'px';
        }
    }

    handleClose(e) {
        if (this.state.visible && this.el_select && !contains(this.el_select, e.target)) {
            this.hideComponent();
        }
    }

    handleToggle() {
        if (this.props.disabled) return;
        if (this.state.visible) {
            this.hideComponent()
        } else {
            this.renderComponent();
        }
    }

    handleKeyDown(e) {
        let {onKeyDown, disabled} = this.props;
        let renderData = this.state.renderData;
        let length = renderData.length;
        let keyCode = e.keyCode;
        if (this.state.visible && !disabled && length) {
            if (keyCode === KeyCode.DOWN) {
                e.preventDefault();
                if (this.index >= 0) this.el_select_ul.children[this.index].classList.remove('el-select-selected');
                this.setPreSelect(length);
                this.el_select_ul.children[this.index].classList.add('el-select-selected');
            } else if (keyCode === KeyCode.UP) {
                e.preventDefault();
                if (this.index >= 0) this.el_select_ul.children[this.index].classList.remove('el-select-selected');
                this.setPreSelect(length, true);
                this.el_select_ul.children[this.index].classList.add('el-select-selected');
            } else if (keyCode === KeyCode.ENTER && this.index >= 0) {
                this.el_select_ul.children[this.index].click();
            }
        } else if (keyCode === KeyCode.ENTER) {
            this.handleToggle();
        }
        if (onKeyDown) onKeyDown(e)
    }

    handleChange(e) {
        let {value} = e;
        let {onMatch, matchCase} = this.props;
        this.setState(prev => {
            prev.renderValue = value;
            let renderData = onMatch ? onMatch(value) :
                this.handleTryMatch(value, matchCase, [].concat(prev.data));
            prev.renderData = renderData || [];
            return prev;
        }, () => {
            this.renderComponent();
        });
    }

    handleTryMatch(value, matchCase, data) {
        let output = [];
        value = matchCase ? value : `${value}`.toLowerCase();
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let label = matchCase ? item.label : `${item.label}`.toLowerCase();
            if (~label.indexOf(value)) {
                output.push(extend({}, item));
            }
        }
        return output
    }

    handleToggleInput(focus) {
        this.setState(prev => {
            prev.focus = focus;
            if (!focus) {
                prev.renderData = [].concat(prev.data);
                prev.renderValue = prev.selectedLabel.join(", ");
            }
            return prev
        });
    }

    handleSelect(e, value, selected) {
        let {name, onChange, readOnly} = this.props;
        if (readOnly) return;
        onChange({e, name, value, selected});
        this.handleToggle();
    }

    handleSelectAll(e, allValue, selected) {
        let {selectedValue} = this.state;
        let {name, onChange, onSelectAll, readOnly} = this.props;
        if (readOnly) return;
        if (!onSelectAll) {
            allValue.map(value => {
                if (selected && ~selectedValue.indexOf(value)) return;
                onChange({e, name, value, selected});
            });
        } else {
            if (!selected) allValue = [];
            onSelectAll({e, name, value: allValue.slice(), selected});
        }
        this.handleToggle();
    }

    handleDisableSelect() {
        if (this.index >= 0) this.el_select_ul.children[this.index].classList.remove('el-select-selected');
        this.index = -1;
    }

    renderComponent() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.style.position = 'absolute';
            this.container.style.left = '-9999px';
            this.container.style.top = '-9999px';
            this.container.style.width = 0;
            document.body.appendChild(this.container);
        }
        ReactDOM.unstable_renderSubtreeIntoContainer(this, this.optionsRender(), this.container);
        this.setState({visible: true}, () => {
            this.addStyle();
        });
    }

    hideComponent() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        if (this.index >= 0) {
            this.el_select_ul.children[this.index].classList.remove('el-select-selected');
        }
        this.setState({visible: false});
    }

    addStyle() {
        if (!this.state.visible || !this.container) return;
        this.getPosition();
        for (let style in this.style) {
            this.container.style[style] = this.style[style];
        }
        this.container.style.display = 'block';

    }

    optionsRender() {
        let {data, renderData, allValue, selectedValue} = this.state;
        let {multiple, searchable, selectedAll, selectedAllText, noMatchText} = this.props;
        return (
            <div className="el-select-dropdown">
                <ul ref={c => {
                    this.el_select_ul = c
                }}>
                    {(searchable && !renderData.length) &&
                    <li key="no-data" className="el-select-no-data">{noMatchText}</li>}
                    {(multiple && selectedAll && renderData.length === data.length) &&
                    <Option
                        key="all"
                        multiple={multiple}
                        label={selectedAllText}
                        value={allValue.slice()}
                        onChange={this.handleSelectAll.bind(this)}
                        selected={allValue.slice().sort().join("") === selectedValue.slice().sort().join("")}
                    />
                    }
                    {renderData.map((props) => {
                        return (
                            <Option
                                {...props}
                                key={props.value}
                                multiple={multiple}
                                onChange={this.handleSelect.bind(this)}
                                onDisableChange={this.handleDisableSelect.bind(this)}
                                selected={!!~selectedValue.indexOf(props.value)}
                            />
                        );
                    })}
                </ul>
            </div>
        )
    }

    render() {
        let {renderValue, visible} = this.state;
        let icon = visible ? <i className="el-caret el-select-open"/> : <i className="el-caret"/>;
        let {
            size, style, value, noMatchText, matchCase, onMatch,
            searchable, selectedAll, defaultValue, selectedAllText,
            multiple, onChange, className, children, ...other
        } = this.props;
        let _className = classnames('el-select-wrapper', className, size ? `el-${size}` : '');
        return (
            <div className={_className} style={style} ref={(c) => {
                this.el_select = c
            }}>
                <Input
                    {...other}
                    size={size}
                    icon={icon}
                    autoComplete="off"
                    value={renderValue}
                    readOnly={!searchable}
                    onClick={this.handleToggle.bind(this)}
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                    onFocus={this.handleToggleInput.bind(this, true)}
                    onBlur={this.handleToggleInput.bind(this, false)}
                />
            </div>
        )
    }
}

Select.propTypes = {
    onMatch: PropTypes.func,
    multiple: PropTypes.bool,
    matchCase: PropTypes.bool,
    searchable: PropTypes.bool,
    selectedAll: PropTypes.bool,
    onSelectedAll: PropTypes.func,
    noMatchText: PropTypes.string,
    selectedAllText: PropTypes.string,
    size: PropTypes.oneOf(['default', 'large', 'small'])
};

Select.defaultProps = {
    value: "",
    selectedAllText: "全选",
    noMatchText: "暂无匹配数据",
    onChange: () => {
    },
    defaultValue: ""
};