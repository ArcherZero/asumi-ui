/**
 * Created by elly on 2017/4/8.
 */
import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';

export default  class Checkbox extends Component {
    constructor(props) {
        super(props);
    }

    handleChange(e) {
        let {name, value, checked, readOnly, disabled} = this.props;
        if (disabled || readOnly) return;
        this.props.onChange({e, name, value, checked: !checked});
    }

    render() {
        let {label, checked, className, indeterminate, onChange, disabled, children, ...other} = this.props;
        let _className = classnames('el-checkbox-wrapper', disabled ? 'el-disabled' : '', className);
        return (
            <label className={_className}>
                <span className="el-checkbox">
                    <input
                        {...other}
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        className="el-checkbox-input"
                        onChange={this.handleChange.bind(this)}/>
                    {indeterminate ?
                        <span className="fa fa-minus-square el-checked"/> :
                        (checked ?
                                <span className="fa fa-check-square el-checked"/> :
                                <span className="fa fa-square-o el-unchecked"/>
                        )}
                </span>
                <span>{children || label}</span>
            </label>
        )
    }
}

Checkbox.propTypes = {};

Checkbox.defaultProps = {
    checked: false,
    onChange: ()=> {
    }
};