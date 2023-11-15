import { connect } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { MapRef, useMap } from 'react-map-gl'

import MobileNavigationBar from '../../mobile/navigation-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import * as apiActions from '../../../actions/api'
import * as uiActions from '../../../actions/ui'

import {
  FloatingLoadingIndicator,
  NearbySidebarContainer,
  Scrollable
} from './styled'
import { MainPanelContent } from '../../../actions/ui-constants'
import Loading from '../../narrative/loading'
import MobileContainer from '../../mobile/container'
import RentalStation from './rental-station'
import Stop from './stop'
import Vehicle from './vehicle-rent'
import VehicleParking from './vehicle-parking'

type LatLonObj = { lat: number; lon: number }

type Props = {
  fetchNearby: (latLon: LatLonObj, map?: MapRef) => void
  hideBackButton?: boolean
  mobile?: boolean
  nearby: any
  nearbyViewCoords?: LatLonObj
  setMainPanelContent: (content: number) => void
}

const getNearbyItem = (place: any) => {
  switch (place.__typename) {
    case 'RentalVehicle':
      return <Vehicle key={place.id} vehicle={place} />
    case 'Stop':
      return <Stop showOperatorLogo stopData={place} />
    case 'VehicleParking':
      return <VehicleParking place={place} />
    case 'BikeRentalStation':
      return <RentalStation place={place} />
    default:
      return `${place.__typename}you are from the future and have a cool new version of OTP2 let me know how it is mlsgrnt@icloud.com`
  }
}

const getNearbyItemList = (nearby: any) => {
  return nearby?.map((n: any) => (
    <div key={n.place.id}>{getNearbyItem(n.place)}</div>
  ))
}

function NearbyView(props: Props): JSX.Element {
  const { fetchNearby, mobile, nearby, nearbyViewCoords, setMainPanelContent } =
    props
  const map = useMap().current
  const intl = useIntl()
  const [loading, setLoading] = useState(true)
  const firstItemRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    firstItemRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (nearbyViewCoords) {
      fetchNearby(nearbyViewCoords, map)
      setLoading(true)
      const interval = setInterval(() => {
        fetchNearby(nearbyViewCoords, map)
        setLoading(true)
      }, 15000)
      return function cleanup() {
        clearInterval(interval)
      }
    }
  }, [nearbyViewCoords])

  useEffect(() => {
    setLoading(false)
  }, [nearby])

  const MainContainer = mobile ? MobileContainer : Scrollable

  return (
    <MainContainer className="nearby-view base-color-bg">
      <MobileNavigationBar
        headerText={intl.formatMessage({ id: 'components.NearbyView.header' })}
        onBackClicked={useCallback(() => setMainPanelContent(0), [])}
      />
      <NearbySidebarContainer
        className="base-color-bg"
        style={{ marginTop: mobile ? '50px' : 0 }}
      >
        <div ref={firstItemRef} />
        {loading && (
          <FloatingLoadingIndicator>
            <Loading extraSmall />
          </FloatingLoadingIndicator>
        )}
        {nearby &&
          (nearby.error ? (
            intl.formatMessage({ id: 'components.NearbyView.error' })
          ) : nearby.length > 0 ? (
            getNearbyItemList(nearby)
          ) : (
            <FormattedMessage id="components.NearbyView.nothingNearby" />
          ))}
      </NearbySidebarContainer>
    </MainContainer>
  )
}

const mapStateToProps = (state: any) => {
  const { config, transitIndex, ui } = state.otp
  const { nearbyViewCoords } = ui
  const { nearby } = transitIndex
  return {
    homeTimezone: config.homeTimezone,
    nearby,
    nearbyViewCoords
  }
}

const mapDispatchToProps = {
  fetchNearby: apiActions.fetchNearby,
  setMainPanelContent: uiActions.setMainPanelContent
}

export default connect(mapStateToProps, mapDispatchToProps)(NearbyView)
