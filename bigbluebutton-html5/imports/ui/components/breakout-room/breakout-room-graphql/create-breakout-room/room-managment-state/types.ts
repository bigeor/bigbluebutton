import { User } from '/imports/ui/Types/user';

export type BreakoutUser = Pick<User, 'userId' | 'name' | 'isModerator'>;

export type Room = {
  id: number;
  name: string;
  users: BreakoutUser[];
};

export interface moveUserRegistery {
  [userId: string]: {
    fromRoomId?: string;
    toRoomId?: string;
    fromSequence: number;
    toSequence: number;
  }
}

export type RoomToWithSettings = {
  name: string;
  users: string[];
  captureNotesFilename: string;
  captureSlidesFilename: string;
  isDefaultName: boolean;
  freeJoin: boolean;
  sequence: number;
  shortName: string;
};

export type Rooms = {
  [key: number]: Room;
};

export type ChildComponentProps = {
  moveUser: (userId: string, fromRoomId: number, toRoomId: number) => void;
  rooms: Rooms;
  getRoomName: (roomId: number) => string;
  changeRoomName: (roomId: number, name: string) => void;
  numberOfRooms: number;
  selectedId: string;
  setSelectedId: (id: string) => void;
  selectedRoom: number;
  setSelectedRoom: (id: number) => void;
  randomlyAssign: () => void;
  resetRooms: (cap: number) => void;
  users: BreakoutUser[];
}
