/**
 * Created by elly on 2017/4/13.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import FormItem from './formItem';
import Button from '../button';
import {noop} from "../util";

function isRequired({validate, required}) {
    return (required || (validate && validate.some(item => {
        return item.required;
    })));
}

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            disabledName: "",
            beforeSubmit: false
        }
    }

    componentDidMount() {
        let {data, options} = this.props;
        this.validator(data, options)
    }

    componentWillReceiveProps({data, options}) {
        this.validator(data, options)
    }

    validator(data, options) {
        if (!options) return;
        let disabledIndex = -1;
        let _disabledIndex = -1;
        let state = this.state;
        let disabled = options.some((item, index) => {
            if (state.disabled && state.disabledName && item.name === state.disabledName) {
                _disabledIndex = index;
            }
            if (isRequired(item) && (data[item.name] == null || data[item.name] === "")) {
                disabledIndex = index;
                return true;
            }
        });
        if (disabled) {
            this.handleDisabled(options[disabledIndex], true);
        } else if (~_disabledIndex) {
            this.handleDisabled(options[_disabledIndex], false);
        }
    }

    handleDisabled(props, _disabled) {
        let {disabled, disabledName} = this.state;
        if (props.name === disabledName && _disabled != disabled) {
            this.setState({disabled: _disabled});
        } else if (!disabled && _disabled && props.name !== disabledName) {
            this.setState({disabled: _disabled, disabledName: props.name});
        }
    }

    handleChange({name, type, off}, {value, checked, selected}) {
        if (this.props.onChange) {
            if (type === "switch" && !checked) {
                this.props.onChange({name, type, value: off, checked, selected});
            } else {
                this.props.onChange({name, type, value, checked, selected});
            }
        }
    }

    handleSubmit() {
        let {validator, onSubmit} = this.props;
        this.setState({beforeSubmit: true}, () => {
            if (this.state.disabled) {
            } else {
                let disabled = validator && validator();
                if (disabled) {
                    this.setState({disabled: true})
                } else {
                    onSubmit && onSubmit();
                }
            }
            this.setState({beforeSubmit: false});
        })
    }

    render() {
        let {disabled, beforeSubmit} = this.state;
        let {data, error, style, hideSubmitButton, options, layout, title, className, submitText, children} = this.props;
        let _className = classnames('el-form', layout ? `el-${layout}` : null, className);
        return (
            <form className={_className} style={style}>
                {!!title && <div className="el-form-title">{title}</div>}
                {options.map((props, index) => {
                    return (
                        <FormItem
                            onChange={this.handleChange.bind(this, props)}
                            {...props}
                            key={index}
                            data={data[props.name]}
                            beforeSubmit={beforeSubmit}
                            required={isRequired(props)}
                            validator={this.handleDisabled.bind(this, props)}
                        />)
                })}
                {children}
                <FormItem>
                    {!hideSubmitButton &&
                    <Button
                        disabled={disabled}
                        type={disabled ? null : "success"}
                        onClick={this.handleSubmit.bind(this)}>
                        {submitText}
                    </Button>}
                    {!!error && <div className="el-form-error">{error}</div>}
                </FormItem>
            </form>
        )
    }
}

Form.propTypes = {
    error: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    validator: PropTypes.func,
    id: PropTypes.string.isRequired,
    hideSubmitButton: PropTypes.bool,
    data: PropTypes.object.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        required: PropTypes.bool,
        onChange: PropTypes.func,
        name: PropTypes.string.isRequired,
        tips: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                title: PropTypes.string,
                content: PropTypes.any
            })]),
        validateType: PropTypes.oneOf(['error', 'warning']),
        validate: PropTypes.arrayOf(PropTypes.shape({
            max: PropTypes.any,
            min: PropTypes.any,
            len: PropTypes.number,
            required: PropTypes.bool,
            validator: PropTypes.func,
            message: PropTypes.string,
            regExp: PropTypes.instanceOf(RegExp),
            trigger: PropTypes.oneOf(['blur', 'change', 'submit']),
            rule: PropTypes.oneOf(['color', 'price', 'nature', 'positiveInt']),
            type: PropTypes.oneOf(['boolean', 'array', 'string', 'object', 'number']),
        })),
        type: PropTypes.oneOf(['text', 'color', 'password', 'component', 'textarea', 'select', 'checkbox', 'radio', 'switch', 'uploader', 'radiogroup', 'checkgroup']),
    })),
    layout: PropTypes.oneOf(['horizontal', 'vertical', 'inline'])
};

Form.defaultProps = {
    id: "id",
    onChange: noop,
    submitText: '提交',
    layout: "horizontal"
};