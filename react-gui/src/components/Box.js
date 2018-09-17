import React, { Component } from 'react';

export default class Box extends Component {
    render() {
        const { box, currentDirection } = this.props;
        let cssClass = '';
        let cssDirection = '';
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
                cssClass += 'robot ' + currentDirection + '-direction';
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
