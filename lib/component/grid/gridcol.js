'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by elly on 2017/5/26.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var GridCol = function (_Component) {
    _inherits(GridCol, _Component);

    function GridCol(props) {
        _classCallCheck(this, GridCol);

        return _possibleConstructorReturn(this, (GridCol.__proto__ || Object.getPrototypeOf(GridCol)).call(this, props));
    }

    _createClass(GridCol, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                offset = _props.offset,
                col = _props.col,
                className = _props.className,
                style = _props.style,
                inline = _props.inline,
                children = _props.children;

            var _className = (0, _classnames2['default'])('el-col-' + col, inline ? 'el-col-inline' : '', offset != undefined ? 'el-col-offset-' + offset : '', className);
            return _react2['default'].createElement(
                'div',
                { className: _className, style: style },
                children
            );
        }
    }]);

    return GridCol;
}(_react.Component);

exports['default'] = GridCol;


GridCol.propTypes = {
    col: _propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].string]),
    offset: _propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].string])
};

GridCol.defaultProps = {
    col: 12
};