/**
 * Created by elly on 2017/4/13.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Input from '../input';
import Radio from '../radio';
import Upload from '../upload';
import Select from '../select';
import Editor from '../editor';
import Popover from '../popover';
import Datetime from '../datetime';
import Option from '../select/option';
import NumberInput from '../numberInput';
import Checkbox from "../checkbox/index";
import RadioGroup from '../radio/radioGroup';
import CheckGroup from '../checkbox/checkGroup';
import {rules} from "../util";

function isRequired(validate, required) {
    return required || (validate && validate.some(item => {
        return item.required;
    }));
}

export default class FormItem extends Component {
    constructor(props) {
        super(props);
        this.msg_str = "";
    }

    componentWillReceiveProps({beforeSubmit, data, validate, validator}) {
        if (beforeSubmit && validate && validate.length) {
            let disabled = false;
            validate.map(item => {
                if (!disabled && item.trigger === "submit") {
                    disabled = this.validator(item, data, "submit");
                }
            });
            validator && validator(disabled);
        }
    }

    validator(item, data) {
        let {maxLength, length, isLocaleCompare, min, max, minLength, message, pattern, instance, rule, required, validator, type} = item;
        let reg, fail = validator && validator(this.props);
        let valueType = Object.prototype.toString.call(data).toLowerCase().slice(8, -1);
        let hasLen = (valueType === "array" && (!type || type === "array")) || (valueType === "string" && (!type || type === "string"));
        if (!fail && required && (data == null || data === "")) {
            fail = true
        }
        if (!fail && instance && !data instanceof instance) {
            fail = true;
        }
        if (!fail && type && valueType !== type) {
            fail = true;
        }
        if (!fail && min != null) {
            if (isLocaleCompare && valueType === "string" && data.localeCompare(min) < 0) {
                fail = true;
            } else if (data < min) {
                fail = true;
            }
        }
        if (!fail && max != null) {
            if (isLocaleCompare && valueType === "string" && data.localeCompare(max) > 0) {
                fail = true;
            } else if (data > max) {
                fail = true;
            }
        }
        if (!fail && length != null && hasLen && data.length !== length) {
            fail = true;
        }
        if (!fail && minLength != null && hasLen && data.length < minLength) {
            fail = true;
        }
        if (!fail && maxLength != null && hasLen && data.length > maxLength) {
            fail = true;
        }
        if (!fail && Object.prototype.toString.call(pattern) === '[object RegExp]') {
            reg = pattern;
        } else if (!fail && rule) {
            reg = rules[rule];
        }
        if (!fail && reg && !reg.test(data)) {
            fail = true;
        }
        if (fail) {
            this.msg_str = message;
            this._message.innerHTML = message;
            this._form_item.classList.add(`el-form-item-${this.props.validateType}`);
        }
        return fail;
    }

    handleBlur() {
        let {data, onBlur, validate, validator, required, validateType} = this.props;
        let disabled = false;
        if (validate && validate.length) {
            validate.map(item => {
                if (!disabled && item.trigger === "blur") {
                    disabled = this.validator(item, data);
                }
            })
        }
        if (!disabled && this.msg_str) {
            this._form_item.classList.remove(`el-form-item-${validateType}`);
            this._message.innerHTML = "";
            this.msg_str = ""
        }
        if (!disabled && required && (data == null || data === "")) {
            disabled = true;
        }
        validator && validator(disabled);
        onBlur && onBlur.apply(null, arguments);

    }

    handleChange({value}) {
        let {data, onChange, validate, validator, validateType} = this.props;
        let disabled = false;
        let _value = value === undefined ? data : value;
        if (validate && validate.length) {
            validate.map(item => {
                if (!disabled && item.trigger === "change") {
                    disabled = this.validator(item, _value);
                }
            })
        }
        if (!disabled && this.msg_str) {
            this._form_item.classList.remove(`el-form-item-${validateType}`);
            this._message.innerHTML = "";
            this.msg_str = "";
        }
        validator && validator(disabled);
        onChange && onChange.apply(null, arguments);
    }

    itemRender() {
        let {on, off, tips, col, requiredMark, name, data, colon, component, className, dataFormat, content, value, type, onBlur, beforeSubmit, onChange, children, options, validate, validateType, validator, labelWidth, ...config} = this.props;
        if (type !== "upload" && children) return children;
        let output = null;
        switch (type) {
            case "textarea":
                output =
                    <Input
                        {...config}
                        type="textarea"
                        name={name}
                        value={data}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}/>;
                break;
            case "number":
                output =
                    <NumberInput
                        {...config}
                        name={name}
                        value={data}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}/>;
                break;
            case "select":
                output =
                    <Select
                        {...config}
                        name={name}
                        value={data}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}>
                        {!!options && options.map(item => {
                            return (
                                <Option key={item.value} {...item}/>
                            )
                        })}
                    </Select>;
                break;
            case "switch":
                output =
                    <Radio
                        {...config}
                        type="switch"
                        value={on}
                        name={name}
                        label={null}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}
                        checked={typeof data === "boolean" ? data : on === data}
                    />;
                break;
            case "radio":
                output =
                    <Radio
                        {...config}
                        name={name}
                        value={data}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}
                        checked={typeof data === "boolean" ? data : data === value}
                    />;
                break;
            case "radiogroup":
                output =
                    <RadioGroup
                        {...config}
                        name={name}
                        value={data}
                        options={options}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />;
                break;
            case "checkbox":
                output =
                    <Checkbox
                        {...config}
                        name={name}
                        value={data}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />;
                break;
            case "checkgroup":
                output =
                    <CheckGroup
                        {...config}
                        name={name}
                        options={options}
                        checkedList={data}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />;
                break;
            case "checkboxgroup":
                output =
                    <CheckGroup
                        {...config}
                        name={name}
                        options={options}
                        checkedList={data}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />;
                break;
            case "datetime":
                output = <Datetime
                    {...config}
                    name={name}
                    value={data}
                    onBlur={this.handleBlur.bind(this)}
                    onChange={this.handleChange.bind(this)}
                />;
                break;
            case  "editor":
                output = <Editor
                    {...config}
                    name={name}
                    value={data}
                    onBlur={this.handleBlur.bind(this)}
                    onChange={this.handleChange.bind(this)}
                />;
                break;
            case "upload":
                output = <Upload
                    {...config}
                    name={name}
                    value={data}
                    children={children}
                />;
                break;
            case "static":
                output = <div
                    className="el-form-control-static">
                    {dataFormat ? dataFormat(content || value || data) : (content || value || data)}
                </div>;
                break;
            case "component":
                output = React.cloneElement(component, {
                    name,
                    data,
                    value: data,
                    onBlur: this.handleBlur.bind(this),
                    onChange: this.handleChange.bind(this),
                    ...config
                });
                break;
            default:
                output =
                    <Input
                        {...config}
                        type={type}
                        name={name}
                        value={data}
                        onBlur={this.handleBlur.bind(this)}
                        onChange={this.handleChange.bind(this)}
                    />;
                break;
        }
        return output;
    }

    render() {
        let props = this.props;
        let {tips, label, colon, className, required, validate, requiredMark, labelWidth, col, colSpan} = props;
        let _className = classnames('el-form-item clearfix', col ? `el-col-${col * (colSpan || 1)} el-col-inline` : null, className);
        if (tips && typeof tips === "string") {
            tips = {title: tips};
        }
        let popover = tips ? (
            <Popover {...tips} trigger="hover" placement="top">
                <span className="el-form-tips fa fa-question-circle-o"
                      style={{paddingLeft: 4, paddingRight: label ? null : 4}}/>
            </Popover>) : null;
        let _required = isRequired(validate, required);
        return (
            <div className={_className} ref={c => this._form_item = c}>
                {!label && _required && <span className="el-required">{requiredMark}</span>}
                {!label && popover}
                {!!label &&
                <label className="el-form-label" style={labelWidth ? {width: labelWidth, float: 'left'} : null}>
                    {_required && <span className="el-required">{requiredMark}</span>}
                    {label}{colon && ":"}
                    {popover}
                </label>}
                <div className="el-form-control"
                     style={labelWidth ? {marginLeft: labelWidth, display: 'block'} : null}>
                    {this.itemRender()}
                    <div className="el-form-message" ref={c => this._message = c}/>
                </div>
            </div>
        )
    }
}

FormItem.propTypes = {
    data: PropTypes.any,
    colon: PropTypes.bool,
    name: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    requiredMark: PropTypes.any,
    labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dataFormat: PropTypes.func,
    tips: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            title: PropTypes.string,
            content: PropTypes.any
        })]),
    validateType: PropTypes.oneOf(['error', 'warning']),
    validate: PropTypes.arrayOf(PropTypes.shape({
        maxLength: PropTypes.any,
        minLength: PropTypes.any,
        length: PropTypes.number,
        strict: PropTypes.bool,
        validator: PropTypes.func,
        isLocaleCompare: PropTypes.bool,
        pattern: PropTypes.instanceOf(RegExp),
        instance: PropTypes.any,
        trigger: PropTypes.oneOf(['blur', 'change', 'submit']),
        mix: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        rule: PropTypes.oneOf(['color', 'price', 'nature', 'positiveInt']),
        type: PropTypes.oneOf(['boolean', 'array', 'string', 'object', 'number', 'moment']),
    })),
    type: PropTypes.oneOf(['text', 'color', 'editor', 'static', 'datetime', 'number', 'component', 'password', 'textarea', 'select', 'checkbox', 'radio', 'switch', 'upload', 'radiogroup', 'checkgroup', 'checkboxgroup']),
};

FormItem.defaultProps = {
    type: "text",
    requiredMark: "*",
    validateType: "error"
};


FormItem._component_name = "FormItem";