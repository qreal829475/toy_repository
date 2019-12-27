import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';

class DivideCodeInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showValue: '',
            activeIndex: null
        };
    }

    renderShowInput = (showValue, activeIndex) => {
        let dom = [];
        for (let i = 0; i < this.props.fields; i++) {
            let isActive = false;
            if (i === activeIndex) {
                isActive = true;
            }
            dom.push(
                <div className={`${styles.input} ${isActive ? styles.active : ''}`} key={i}>
                    {showValue[i] ? showValue[i] : ''}
                </div>
            );
        }
        return dom;
    };

    inputChange = e => {
        let value = e.currentTarget.value;
        value = value.replace(/ /g, '').replace(/[^0-9]/gi, '');
        value = value.substr(0, this.props.fields);
        if (value.length == 0) {
            this.setState({
                activeIndex: 0,
                showValue: value
            });
            this.props.onChange && this.props.onChange(value);
        } else if (value.length && value.length < this.props.fields) {
            this.setState({
                activeIndex: value.length,
                showValue: value
            });
            this.props.onChange && this.props.onChange(value);
        } else if (value.length && value.length == this.props.fields) {
            this.setState({
                activeIndex: this.props.fields - 1,
                showValue: value
            });
            this.props.onChange && this.props.onChange(value);
        }
    };

    inputFocus = e => {
        if (this.state.showValue.length == 0) {
            this.setState({
                activeIndex: 0
            });
        } else if (this.state.showValue.length && this.state.showValue.length < this.props.fields) {
            this.setState({
                activeIndex: this.state.showValue.length
            });
        } else if (this.state.showValue.length && this.state.showValue.length == this.props.fields) {
            this.setState({
                activeIndex: this.props.fields - 1
            });
        }
    };

    inputBlur = () => {
        this.setState({
            activeIndex: null
        });
    };

    render() {
        return (
            <div className={styles.DivideCodeInput}>
                <input
                    onChange={this.inputChange}
                    onFocus={this.inputFocus}
                    value={this.state.showValue}
                    onBlur={this.inputBlur}
                />
                <div className={styles.showCode}>
                    {this.renderShowInput(this.state.showValue, this.state.activeIndex)}
                </div>
            </div>
        );
    }
}

DivideCodeInput.propTypes = {
    fields: PropTypes.number,
    onChange: PropTypes.func
};

export default DivideCodeInput;
