import {
    blueBackground,
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

export const blockItem = {
    backgroundColor: "#F8F8F8",
    padding: 15,
    marginBottom: 10,
    borderRadius: 33,
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
}

export default {
    inputField: {
        ...input
    },
    textArea: {
        ...input,
        minHeight: 100,
    },
    blockItem: {
        ...blockItem
    },
    buttonContainer: {
        width: "100%",
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "white",
        borderRadius: 7,
    },
    buttonTitleStyle: {
        fontFamily: "Nunito_700Bold",
        color: blueBackground,
        fontSize: 16,
    },
};
