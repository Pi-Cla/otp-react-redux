import { RouterState } from 'connected-react-router'

import {
  ItineraryExistence,
  MonitoredTrip,
  User
} from '../components/user/types'

import { AppConfig } from './config-types'

export interface OtpState {
  config: AppConfig
  filter: {
    sort: {
      type: string
    }
  }
  // TODO: Add other OTP states
  ui: any // TODO
}

export interface UserState {
  itineraryExistence?: ItineraryExistence
  loggedInUser: User
  loggedInUserMonitoredTrips?: MonitoredTrip[]
  // TODO: Add other user states.
}

export interface AppReduxState {
  calltaker?: any // TODO
  otp: OtpState
  router: RouterState
  user: UserState
}
