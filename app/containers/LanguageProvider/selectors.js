import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectLanguage = state => state.language || initialState;

const selectLocale = () =>
  createSelector(
    selectLanguage,
    languageState => languageState.locale,
  );

export { selectLanguage, selectLocale };
