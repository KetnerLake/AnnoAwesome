import Writeable from "./writeable.js";

export const store = {
  calendar: new Writeable( [] ),
  event: new Writeable( [] ),
  useColors: new Writeable( false )
};
