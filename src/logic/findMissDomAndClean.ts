import removeAllEventListeners from './removeAllEventListeners';
import isRadioInput from '../utils/isRadioInput';
import { Field } from '../index';

export default function findMissDomAndClean(
  fields: { [key: string]: Field },
  validateWithStateUpdate: Function,
  { ref, mutationWatcher, options }: Field,
  forceDelete = false,
) {
  if (!ref) return;

  const { name, type } = ref;
  if (isRadioInput(type) && options) {
    options.forEach(({ ref }, index) => {
      if (!document.body.contains(ref) && fields[name] && fields[name].options && fields[name].options[index]) {
        removeAllEventListeners(fields[name].options[index], validateWithStateUpdate);
        fields[name].options[index].mutationWatcher.disconnect();
        fields[name].options.splice(index, 1);
      }
    });

    if (!fields[name].options.length) {
      delete fields[name];
      return fields;
    }
  } else if (ref && (!document.body.contains(ref) || forceDelete)) {
    removeAllEventListeners(ref, validateWithStateUpdate);
    if (mutationWatcher) mutationWatcher.disconnect();
    delete fields[name];
    return fields;
  }

  return fields;
}
