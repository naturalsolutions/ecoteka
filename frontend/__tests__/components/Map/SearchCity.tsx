import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@/__tests__/utils/test-utils";
import MapSearchCity from "@/components/Map/SearchCity";
import userEvent from "@testing-library/user-event";

let mapSearchCity = null;

test("search city", async () => {
  const handleOnChange = jest.fn();

  render(<MapSearchCity onChange={handleOnChange} />);

  // const autocomplete = screen.getByTestId("autocomplete");
  // const input = within(autocomplete).getByRole("textbox") as HTMLInputElement;

  // fireEvent.change(input, { target: { value: "madr" } });

  // await waitFor(() => {
  //   expect(screen.getByText("Madrid, Spain")).toBeInTheDocument();
  // });

  // screen.getByText("Madrid, Spain").click();

  // expect(input.value).toEqual("Madrid, Spain");
  // expect(handleOnChange).toHaveBeenCalledWith([-3.68582, 40.47779]);
});
