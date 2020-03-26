import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import GlobalStyle from 'global-styles';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import { changeLocale as changeLocaleAction } from 'containers/LanguageProvider/actions';
import { selectLocale } from 'containers/LanguageProvider/selectors';

export const App = props => {
  const { changeLocale, locale } = props;
  const handleChange = e => {
    changeLocale(e.target.value);
  };
  return (
    <div>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleChange}
        value={locale}
      >
        <MenuItem value="en">en</MenuItem>
        <MenuItem value="vi">vi</MenuItem>
      </Select>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </div>
  );
};

App.propTypes = {
  changeLocale: PropTypes.func,
  locale: PropTypes.string,
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  changeLocale: locale => dispatch(changeLocaleAction(locale)),
});

const mapStateToProps = createStructuredSelector({
  locale: selectLocale(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(React.memo(App));
