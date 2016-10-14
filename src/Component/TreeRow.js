/**
 * Created by BG236557 on 2016/5/27.
 */
import React, {Component} from 'react';

export default class TreeRow extends Component {
    constructor(props) {
        super(props);
    }

    cellRender() {
        let output = [];
        let {
            data,
            cols,
            isKey,
            checked,
            isSelect,
            selectRow,
            hideSelectColumn
        } = this.props;

        const _key = data[isKey];

        if (isSelect && !hideSelectColumn) {
            output.push(
                <td key={_key} style={{backgroundColor: checked && selectRow.bgColor, textAlign: 'center'}}>
                    <input type={selectRow.mode} checked={checked} readOnly={true}/>
                </td>
            )
        }

        cols.map((key, i, col) => {

            let cell = data[key.id];
            let dataFormat = key.dataFormat;

            const style = {
                width: key.width,
                maxWidth: key.width,
                textAlign: key.dataAlign,
                display: key.hidden && 'none',
                backgroundColor: isSelect && checked && selectRow.bgColor
            };

            if (dataFormat) {
                cell = dataFormat.call(null, data[key.id], data, i, col)
            }

            output.push(
                <td style={style}
                    key={'' + _key + i}
                >
                    {cell}
                </td>
            )
        });
        return output;
    }

    render() {
        let {
            data,
            hover,
            checked,
            isSelect,
            selectRow,
            hoverStyle,
            onMouseOut,
            onMouseOver
        } = this.props;
        return (
            <tr style={hover ? hoverStyle : {}}
                onMouseOut={onMouseOut} onMouseOver={onMouseOver}
                onClick={isSelect ? ()=>selectRow.onSelect(!checked, data) : ()=> {
                    return false;
                }}
            >
                {this.cellRender()}
            </tr>
        )
    }
}

TreeRow.defaultProps = {
    hideSelectColumn: false,
};