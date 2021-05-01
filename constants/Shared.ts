import {
    white30,
} from "../constants/Colors";

import {
    paddings,
    borderRadiuses,
} from "../constants/Layout";

export const input = {
    width: "100%",
    borderWidth: 1,
    borderColor: white30,
    borderRadius: borderRadiuses.normal,
    fontFamily: "Nunito_700Bold",
    color: "white",
    padding: paddings.large,
    fontSize: 17,
    textAlignVertical: "top",
};

export default {
    inputField: {
        ...input
    },
    textArea: {
        ...input,
        minHeight: 100,
    }
};
