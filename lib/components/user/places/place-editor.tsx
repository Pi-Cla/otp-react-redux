import { Field } from 'formik'
import {
  FormControl,
  FormGroup,
  HelpBlock,
  ToggleButton,
  ToggleButtonGroup
} from 'react-bootstrap'
import { injectIntl } from 'react-intl'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { InjectedIntlProps } from 'react-intl'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import coreUtils from '@opentripplanner/core-utils'
import React, { Component } from 'react'
import styled from 'styled-components'

import { capitalizeFirst, getErrorStates } from '../../../util/ui'
import { CUSTOM_PLACE_TYPES, isHomeOrWork } from '../../../util/user'
import { getFormattedPlaces } from '../../../util/i18n'
import FormattedValidationError from '../../util/formatted-validation-error'
import Icon, { IconProps } from '../../util/icon'

import {
  makeLocationFieldLocation,
  PlaceLocationField
} from './place-location-field'

const { isMobile } = coreUtils.ui

// Styled components
const LargeIcon = styled(Icon)<IconProps>`
  font-size: 150%;
`
const FixedPlaceIcon = styled(LargeIcon)<IconProps>`
  margin-right: 10px;
  padding-top: 6px;
`
const FlexContainer = styled.div`
  display: flex;
`
const FlexFormGroup = styled(FormGroup)`
  flex-grow: 1;
`
const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  & > label {
    padding: 5px;
  }
`

/**
 * Contains the fields for editing a favorite place.
 * This component uses Formik props that are passed
 * within the Formik context set up by FavoritePlaceScreen.
 */
class PlaceEditor extends Component<
  {
    // FIXME: shared type for errors
    errors: Record<string, boolean>[]
    handleBlur: () => void
    handleChange: () => void
    setValues: (values: unknown) => void
    // Needed for prop spread
    // eslint-disable-next-line @typescript-eslint/ban-types
    values: Object
  } & InjectedIntlProps
> {
  _handleLocationChange = ({
    location
  }: {
    location: {
      lat: number
      lon: number
      name: string
    }
  }) => {
    const { setValues, values } = this.props
    const { lat, lon, name } = location
    setValues({
      ...values,
      address: name,
      lat,
      lon
    })
  }

  render() {
    const { errors, handleBlur, handleChange, intl, values: place } = this.props
    const isFixed = isHomeOrWork(place)
    const errorStates = getErrorStates(this.props)
    const namePlaceholder = intl.formatMessage({
      id: 'components.PlaceEditor.namePlaceholder'
    })

    return (
      <div>
        {!isFixed && (
          <>
            {/* TODO: properly type errorStates
             eslint-disable-next-line @typescript-eslint/ban-ts-comment //
            @ts-ignore */}
            <FormGroup validationState={errorStates.name}>
              {/* onBlur, onChange, and value are passed automatically. */}
              <Field
                aria-label={namePlaceholder}
                as={FormControl}
                name="name"
                placeholder={namePlaceholder}
              />
              <FormControl.Feedback />
              {errors.name && (
                <HelpBlock>
                  <FormattedValidationError type={errors.name} />
                </HelpBlock>
              )}
            </FormGroup>
            <FormGroup>
              <StyledToggleButtonGroup
                defaultValue={place.type}
                name="type"
                type="radio"
              >
                {Object.keys(CUSTOM_PLACE_TYPES).map((k) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  const { icon, type } = CUSTOM_PLACE_TYPES[k]
                  const title = capitalizeFirst(getFormattedPlaces(k, intl))
                  return (
                    <ToggleButton
                      key={type}
                      // onBlur and onChange have to be set on individual controls instead of the control group
                      // in order for Formik to correctly process the changes.
                      onBlur={handleBlur}
                      onChange={handleChange}
                      title={title}
                      value={type}
                    >
                      <LargeIcon type={icon} />
                    </ToggleButton>
                  )
                })}
              </StyledToggleButtonGroup>
            </FormGroup>
          </>
        )}

        <FlexContainer>
          {/* For fixed places, just show the icon for place type instead of all inputs and selectors */}
          {isFixed && <FixedPlaceIcon type={place.icon} />}

          {/* TODO: properly type errorStates
             eslint-disable-next-line @typescript-eslint/ban-ts-comment //
            @ts-ignore */}
          <FlexFormGroup validationState={errorStates.address}>
            <PlaceLocationField
              className="form-control"
              inputPlaceholder={
                isFixed
                  ? intl.formatMessage(
                      { id: 'components.PlaceEditor.locationPlaceholder' },
                      { placeName: place.name }
                    )
                  : intl.formatMessage({
                      id: 'components.PlaceEditor.genericLocationPlaceholder'
                    })
              }
              location={makeLocationFieldLocation(place)}
              locationType="to"
              onLocationSelected={this._handleLocationChange}
              showClearButton={false}
              static={isMobile()}
            />
            <FormControl.Feedback />
            {errors.address && (
              <HelpBlock>
                <FormattedValidationError type={errors.address} />
              </HelpBlock>
            )}
          </FlexFormGroup>
        </FlexContainer>
      </div>
    )
  }
}

export default injectIntl(PlaceEditor)