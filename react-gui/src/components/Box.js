import React, { Component } from 'react';

export default class Box extends Component {
    render() {
        const { box } = this.props;
        let cssClass = '';
        switch (box.content) {
            case '0':
                cssClass += 'dirty';
                break;
            case '1':
                cssClass += 'clean';
                break;
            case 'X':
                cssClass += 'obstacle';
                break;
            case 'R':
                cssClass += 'robot';
                break;
            default:
                cssClass = '';
        }
        return (
            <div className="box">
                <div className={cssClass} />
            </div>
        );
    }
}
