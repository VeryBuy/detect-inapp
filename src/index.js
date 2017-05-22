/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import 'primer-css/build/build.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Clippy from 'react-icons/lib/go/clippy';
import GitHub from 'react-icons/lib/go/mark-github';
import DiffRenamed from 'react-icons/lib/go/diff-renamed';
import Clipboard from 'clipboard';
import InApp from './inapp';
import qrcode from './qrcode.png';
import './index.css';

class App extends Component {

  state = {
    inapp: null,
    value: '',
    useragent: '',
    isShowButton: true,
    scheme: 'twitter://timeline',
    packageName: 'com.twitter.android',
  }

  componentWillMount() {
    const useragent = navigator.userAgent || navigator.vendor || window.opera;
    const inapp = new InApp(useragent);
    const value = [`${useragent}`];
    if (navigator) for (let key in navigator) value.push(`${key}=${navigator[key]}`); // eslint-disable-line
    this.setState({ inapp, useragent, value: value.join('\n') });
    window.ga('send', 'event', 'inapp.os', useragent, inapp.os);
    window.ga('send', 'event', 'inapp.device', useragent, inapp.device);
    window.ga('send', 'event', 'inapp.browser', useragent, inapp.browser);
    window.ga('send', 'event', 'inapp.value', useragent, value.join('&'));
  }

  componentDidMount() {
    new Clipboard('.copy'); // eslint-disable-line
  }

  onSchemeChange = e => this.setState({ scheme: e.target.value });
  onPackageNameChange = e => this.setState({ packageName: e.target.value });

  onOpenClick = async () => {
    const { inapp, scheme, packageName } = this.state;
    const reply = await inapp.open({ [inapp.os]: { scheme, packageName } });
    if (!reply) alert('Cannot Open'); // eslint-disable-line
  }

  onBrowserClick = (name) => {
    const { useragent } = this.state;
    window.ga('send', 'event', 'click.browser', useragent, name);
    this.setState({ isShowButton: false });
  }

  render() {
    const { inapp, value, scheme, packageName, isShowButton } = this.state;

    return (
      <div>
        <div className="container">
          <div>
            <textarea id="useragent" defaultValue={value} style={{ width: '100%' }} rows="10" />
          </div>
          <div>
            <span className="input-group-button">
              <button className="btn copy" data-clipboard-target="#useragent">
                <Clippy />&nbsp;Copy UserAgent
              </button>
              <a className="btn" target="inapp" href={`https://github.com/f2etw/detect-inapp/issues/new?title=%5BUserAgent%5D&body=${encodeURIComponent(value)}`}>
                <GitHub />&nbsp;Share
              </a>
            </span>
          </div>
        </div>
        <hr />
        <div className="container">
          <div className="p-3 border position-relative">
            {inapp.os}
            <div className="border position-absolute right-0 top-0 p-1">inapp.os</div>
          </div>
          <div className="p-3 border position-relative">
            {inapp.device}
            <div className="border position-absolute right-0 top-0 p-1">inapp.device</div>
          </div>
          <div className="p-3 border position-relative">
            <div>{inapp.browser}</div>
            {isShowButton && ['Messenger', 'Facebook', 'LINE', 'WeChat', 'Twitter', 'Instagram', 'Snapchat', 'Chrome', 'Firefox', 'Safari', 'Internet Explorer', 'Android Native', 'Vivaldi', 'MI', 'Puffin', 'Other', 'QRCode Scanner'].map(name => (
              <button className="btn" onClick={() => this.onBrowserClick(name)}>{name}</button>
            ))}
            <div className="border position-absolute right-0 top-0 p-1">inapp.browser</div>
          </div>
          <div className="p-3 border position-relative">
            {inapp.isMobile() ? 'true' : 'false'}
            <div className="border position-absolute right-0 top-0 p-1">inapp.isMobile()</div>
          </div>
          <div className="p-3 border position-relative">
            {inapp.isDesktop() ? 'true' : 'false'}
            <div className="border position-absolute right-0 top-0 p-1">inapp.isDesktop()</div>
          </div>
          <div className="p-3 border position-relative">
            {inapp.isInApp() ? 'true' : 'false'}
            <div className="border position-absolute right-0 top-0 p-1">inapp.isInApp()</div>
          </div>
          <div className="p-3 border position-relative">
            {inapp.isApplePay() ? 'true' : 'false'}
            <div className="border position-absolute right-0 top-0 p-1">inapp.isApplePay()</div>
          </div>
          <div className="p-3 border position-relative">
            <div className="input-group">
              <input className="form-control" type="text" defaultValue={scheme} onChange={this.onSchemeChange} placeholder="Scheme" />
              <span className="input-group-button">
                <button className="btn" onClick={this.onOpenClick}>
                  <DiffRenamed />
                </button>
              </span>
              <div>
                <input className="form-control" type="text" defaultValue={packageName} onChange={this.onPackageNameChange} placeholder="Android package name" />
              </div>
            </div>
            <div className="border position-absolute right-0 top-0 p-1">inapp.open()</div>
          </div>
        </div>
        <hr />
        <div className="container">
          <div className="qrcode">
            <img src={qrcode} alt="qrcode" />
          </div>
          <div>
            <a className="github-button" href="https://github.com/f2etw/detect-inapp/issues" data-size="large" data-show-count="true" data-icon="octicon-issue-opened" aria-label="Issue f2etw/detect-inapp on GitHub">Issue</a>&nbsp;
            <a className="github-button" href="https://github.com/f2etw/detect-inapp/fork" data-size="large" data-show-count="true" data-icon="octicon-repo-forked" aria-label="Fork f2etw/detect-inapp on GitHub">Fork</a>&nbsp;
            <a className="github-button" href="https://github.com/f2etw/detect-inapp" data-size="large" data-show-count="true" data-icon="octicon-star" aria-label="Star f2etw/detect-inapp on GitHub">Star</a>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));