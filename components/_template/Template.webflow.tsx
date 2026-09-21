import { declareComponent } from '@webflow/react';
import { props } from '@webflow/data-types';
import { Template } from './Template';

export default declareComponent(Template, {
  name: 'Component Template',
  description: 'Starter template for Capte Webflow Code Components',
  group: 'General',
  props: {
    title: props.Text({
      name: 'Title',
      defaultValue: 'Component Heading',
    }),
    body: props.Text({
      name: 'Body Copy',
      defaultValue: 'Configure your component description here.',
    }),
  },
});
