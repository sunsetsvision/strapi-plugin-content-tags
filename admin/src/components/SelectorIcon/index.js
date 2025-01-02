import React from "react";
import styled from "styled-components";
import { Icon, Flex } from "@strapi/design-system/v2";
import { List } from "@strapi/icons";

const IconBox = styled(Flex)`
  background-color: #f0f0ff; /* primary100 */
  border: 1px solid #d9d8ff; /* primary200 */

  svg > path {
    fill: #4945ff; /* primary600 */
  }
`;

const SelectorIcon = () => {
  return (
    <IconBox
      justifyContent="center"
      alignItems="center"
      width={7}
      height={6}
      hasRadius
      aria-hidden
    >
      <Icon as={List} />
    </IconBox>
  );
};

export default SelectorIcon;
