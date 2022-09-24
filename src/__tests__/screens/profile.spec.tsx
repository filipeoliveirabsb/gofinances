import React from 'react';
import { render } from '@testing-library/react-native';

import { Profile } from '../../screens/Profile';

test('check correctly input name placeholder', () => {
    const { getByPlaceholderText} = render(<Profile/>);
    const inputName = getByPlaceholderText('Name');

    expect(inputName.props.placeholder).toBeTruthy();
}); 