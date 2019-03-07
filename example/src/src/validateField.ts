import getValidRadioValue from './getValidRadioValue';
import { RegisterInput } from '.';

export default ({ ref: { type, value, name }, required, maxLength, minLength, min, max, pattern, validate }: RegisterInput, fields) => {
  const copy = {};

  if (
    (type !== 'radio' && required && value === '') ||
    (type === 'radio' && required && !getValidRadioValue(fields[name].options).isValid)
  ) {
    copy[name] = {
      required: true,
    };
  }

  // min and max section
  if (min || max) {
    let exceedMax;
    let exceedMin;
    const valueNumber = parseFloat(value);

    if (type === 'number') {
      exceedMax = max && valueNumber > max;
      exceedMin = min && valueNumber < min;
    } else if (['date', 'time', 'month', 'datetime', 'datetime-local', 'week'].includes(type)) {
      exceedMax = max && new Date(value) > new Date(max);
      exceedMin = min && new Date(value) < new Date(min);
    }

    if (exceedMax || exceedMin) {
      copy[name] = {
        ...copy[name],
        ...(exceedMax ? { max: true } : null),
        ...(exceedMin ? { min: true } : null),
      };
    }
  }

  if (maxLength || minLength) {
    if (['text', 'email', 'password', 'search', 'tel', 'url'].includes(type) && typeof value === 'string') {
      const exceedMax = maxLength && value.length > maxLength;
      const exceedMin = minLength && value.length < minLength;

      if (exceedMax || exceedMin) {
        copy[name] = {
          ...copy[name],
          ...(exceedMax ? { maxLength: true } : null),
          ...(exceedMin ? { minLength: true } : null),
        };
      }
    }
  }

  if (
    pattern &&
    type === 'text' &&
    typeof value === 'string' &&
    pattern instanceof RegExp &&
    !pattern.test(value)
  ) {
    copy[name] = {
      ...copy[name],
      pattern: true,
    };
  }

  if (validate && !validate(value)) {
    return copy[name] = {
      ...copy[name],
      validate: true,
    };
  }

  return copy;
};