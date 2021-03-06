/**
 * Created by elly on 2017/4/8.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {noop} from "../util";

export default class Upload extends Component {
    constructor(props) {
        super(props);
    }

    handleChange(e) {
        e.preventDefault();
        let failed = [], succeed = [];
        let fileList = e.target.files || e.dataTransfer.files;
        let {maxSize, onUpload, accept, name, validator, typeValidatorError, sizeValidatorError, validatorError} = this.props;
        let acceptList = accept ? accept.split(/\s*,\s*/) : [];
        for (let i = 0, len = fileList.length; i < len; i++) {
            let isValid = true;
            let file = fileList[i];
            let acceptable = acceptList.some(type => {
                if (type === file.type || type === "*") {
                    return true;
                } else {
                    let _file_type = file.type.split('/');
                    let _type = type.split('/');
                    if (_type[1] === "*" && _type[0] === _file_type[0]) {
                        return true;
                    }
                }
            });
            if (maxSize && file.size > maxSize) {
                validatorError(file, i, fileList);
                sizeValidatorError(file, i, fileList);
                isValid = false;
                failed.push(i);
            }
            if (accept && !acceptable) {
                validatorError(file, i, fileList);
                typeValidatorError(file, i, fileList);
                isValid = false;
                failed.push(i);
            }
            if (validator && !validator(file)) {
                validatorError(file, i, fileList);
                isValid = false;
                failed.push(i);
            }
            if (isValid) {
                succeed.push(file);
            }
        }
        onUpload({files: fileList, succeed, value: succeed, failed, name, e});
        this._uploader.value = '';
    }

    render() {
        let {name, accept, className, style, multiple, disabled, onBlur, children} = this.props;
        let _className = classnames("el-uploader-wrapper", className);
        return (
            <div
                style={style}
                className={_className}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
            >
                <input
                    type="file"
                    className="el-uploader"
                    name={name}
                    accept={accept}
                    onBlur={onBlur}
                    disabled={disabled}
                    multiple={multiple}
                    ref={(c) => this._uploader = c}
                    onChange={this.handleChange.bind(this)}
                />
                {React.Children.toArray(children).map((elm, i) => {
                    return React.cloneElement(elm, {key: i, disabled});
                })}
            </div>
        )
    }
}

Upload.propTypes = {
    name: PropTypes.string,
    style: PropTypes.object,
    onBlur: PropTypes.func,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    onUpload: PropTypes.func,
    validator: PropTypes.func,
    maxSize: PropTypes.number,
    className: PropTypes.string,
    validatorError: PropTypes.func,
    sizeValidatorError: PropTypes.func,
    typeValidatorError: PropTypes.func,
};

Upload.defaultProps = {
    onUpload: noop,
    validatorError: noop,
    typeValidatorError: noop,
    sizeValidatorError: noop
};