import React, { useContext } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { injectIntl } from 'react-intl';
import { useSubscription } from '@apollo/client';
import getFromUserSettings from '/imports/ui/services/users-settings';
import Auth from '/imports/ui/services/auth';
import { UsersContext } from '../components-data/users-context/context';
import ActionsBar from './component';
import Service from './service';
import UserListService from '/imports/ui/components/user-list/service';
import ExternalVideoService from '/imports/ui/components/external-video-player/service';
import CaptionsService from '/imports/ui/components/captions/service';
import TimerService from '/imports/ui/components/timer/service';
import { layoutSelectOutput, layoutDispatch } from '../layout/context';
import { isExternalVideoEnabled, isPollingEnabled, isPresentationEnabled } from '/imports/ui/services/features';
import { isScreenBroadcasting, isCameraAsContentBroadcasting } from '/imports/ui/components/screenshare/service';
import { PluginsContext } from '/imports/ui/components/components-data/plugin-context/context';
import {
  CURRENT_PRESENTATION_PAGE_SUBSCRIPTION,
} from '/imports/ui/components/whiteboard/queries';
import MediaService from '../media/service';

const ActionsBarContainer = (props) => {
  const actionsBarStyle = layoutSelectOutput((i) => i.actionBar);
  const layoutContextDispatch = layoutDispatch();

  const { data: presentationPageData } = useSubscription(CURRENT_PRESENTATION_PAGE_SUBSCRIPTION);
  const presentationPage = presentationPageData?.pres_page_curr[0] || {};
  const isThereCurrentPresentation = !!presentationPage?.presentationId;

  const usingUsersContext = useContext(UsersContext);
  const {
    pluginsExtensibleAreasAggregatedState,
  } = useContext(PluginsContext);
  let actionBarItems = [];
  if (pluginsExtensibleAreasAggregatedState.actionsBarItems) {
    actionBarItems = [
      ...pluginsExtensibleAreasAggregatedState.actionsBarItems,
    ];
  }

  const { users } = usingUsersContext;

  const currentUser = { userId: Auth.userID, emoji: users[Auth.meetingID][Auth.userID].emoji };

  const amIPresenter = users[Auth.meetingID][Auth.userID].presenter;

  if (actionsBarStyle.display === false) return null;

  return (
    <ActionsBar {
      ...{
        ...props,
        currentUser,
        layoutContextDispatch,
        actionsBarStyle,
        amIPresenter,
        actionBarItems,
        isThereCurrentPresentation,
      }
    }
    />
  );
};

const SELECT_RANDOM_USER_ENABLED = Meteor.settings.public.selectRandomUser.enabled;
const RAISE_HAND_BUTTON_ENABLED = Meteor.settings.public.app.raiseHandActionButton.enabled;
const RAISE_HAND_BUTTON_CENTERED = Meteor.settings.public.app.raiseHandActionButton.centered;

const isReactionsButtonEnabled = () => {
  const USER_REACTIONS_ENABLED = Meteor.settings.public.userReaction.enabled;
  const REACTIONS_BUTTON_ENABLED = Meteor.settings.public.app.reactionsButton.enabled;

  return USER_REACTIONS_ENABLED && REACTIONS_BUTTON_ENABLED;
};

export default withTracker(() => ({
  amIModerator: Service.amIModerator(),
  stopExternalVideoShare: ExternalVideoService.stopWatching,
  enableVideo: getFromUserSettings('bbb_enable_video', Meteor.settings.public.kurento.enableVideo),
  setPresentationIsOpen: MediaService.setPresentationIsOpen,
  handleTakePresenter: Service.takePresenterRole,
  isSharingVideo: Service.isSharingVideo(),
  isSharedNotesPinned: Service.isSharedNotesPinned(),
  hasScreenshare: isScreenBroadcasting(),
  hasCameraAsContent: isCameraAsContentBroadcasting(),
  isCaptionsAvailable: CaptionsService.isCaptionsAvailable(),
  isTimerActive: TimerService.isActive(),
  isTimerEnabled: TimerService.isEnabled(),
  isMeteorConnected: Meteor.status().connected,
  isPollingEnabled: isPollingEnabled() && isPresentationEnabled(),
  isSelectRandomUserEnabled: SELECT_RANDOM_USER_ENABLED,
  isRaiseHandButtonEnabled: RAISE_HAND_BUTTON_ENABLED,
  isRaiseHandButtonCentered: RAISE_HAND_BUTTON_CENTERED,
  isReactionsButtonEnabled: isReactionsButtonEnabled(),
  allowExternalVideo: isExternalVideoEnabled(),
  setEmojiStatus: UserListService.setEmojiStatus,
}))(injectIntl(ActionsBarContainer));
