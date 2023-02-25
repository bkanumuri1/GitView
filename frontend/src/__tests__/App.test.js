import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders login button", () => {
  render(<App />);
  const loginButton = screen.getByRole("button", { name: /login with github/i });
  expect(loginButton).toBeInTheDocument();
});

test("renders search input", () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/search for a repository/i);
  expect(searchInput).toBeInTheDocument();
});

test("searches for a repository", () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/search for a repository/i);
  fireEvent.change(searchInput, { target: { value: "react" } });
  const reactRepo = screen.getByText(/react/i);
  expect(reactRepo).toBeInTheDocument();
});

test("uploads a file", async () => {
  const file = new File(["foo"], "test.xlsx", { type: "application/vnd.ms-excel" });
  const { container } = render(<App />);
  const fileInput = container.querySelector('input[type="file"]');
  Object.defineProperty(fileInput, "files", {
    value: [file],
  });
  fireEvent.change(fileInput);
  await screen.findByText(/foo/i);
});

test("renders repository name", () => {
  const repo = { id: 1, name: "test-repo" };
  render(<App />);
  const repoName = screen.getByText(repo.name);
  expect(repoName).toBeInTheDocument();
});

test("renders contributor name", () => {
  const contributor = { id: 1, name: "test-contributor" };
  render(<App />);
  const contributorName = screen.getByText(contributor.name);
  expect(contributorName).toBeInTheDocument();
});
