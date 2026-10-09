import { expect } from "../utils/custom-expect";
import { getRandomArticle, updateArticleData } from "../utils/data-generator";
import { test } from "../utils/fixtures";

test.describe("Conduit API suite", { tag: "@smoke" }, () => {
  test("Get All Articles without Auth", async ({ api }) => {
    const response = await api
      .path("/articles")
      .params({ limit: "10", offset: "0" })
      .clearAuth()
      .getRequest(200);

    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
  });

  test("Get All Articles with Auth", async ({ api }) => {
    const response = await api
      .path("/articles")
      .params({ limit: "10", offset: "0" })
      .getRequest(200);

    await expect(response).shouldMatchSchema("articles", "GET_articles", true);
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
  });

  test("Get Test Tags", async ({ api }) => {
    const response = await api.path("/tags").getRequest(200);

    // Remove the 'createSchemaFlag' parameter to false to validate against existing schema
    await expect(response).shouldMatchSchema("tags", "GET_tags", true);
    expect(response.tags[0]).shouldEqual("Test");
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
  });

  test("Create and Delete Article", async ({ api }) => {
    const articleRequest = getRandomArticle();

    // Create a new article
    const newArticleResponse = await api
      .path("/articles")
      .body(articleRequest)
      .postRequest(201);

    await expect(newArticleResponse).shouldMatchSchema(
      "articles",
      "POST_articles",
      true,
    );

    const articleSlug = newArticleResponse.article.slug;

    expect(newArticleResponse.article.title).shouldEqual(
      articleRequest.article.title,
    );
    expect(newArticleResponse.article.description).shouldEqual(
      articleRequest.article.description,
    );
    expect(newArticleResponse.article.body).shouldEqual(
      articleRequest.article.body,
    );

    const expectedTags = articleRequest.article.tagList
      .map((tag) => tag.toLowerCase())
      .sort();

    const actualTags = newArticleResponse.article.tagList
      .map((tag: string) => tag.toLowerCase())
      .sort();

    expect(actualTags).shouldEqual(expectedTags);

    // Delete the created article
    await api.path(`/articles/${articleSlug}`).deleteRequest(204);
  });

  test("Create, Update, and Delete Article", async ({ api }) => {
    const articleRequest = getRandomArticle();

    // Create a new article
    const newArticleResponse = await api
      .path("/articles")
      .body(articleRequest)
      .postRequest(201);

    const articleSlug = newArticleResponse.article.slug;

    expect(newArticleResponse.article.title).shouldEqual(
      articleRequest.article.title,
    );
    expect(newArticleResponse.article.description).shouldEqual(
      articleRequest.article.description,
    );
    expect(newArticleResponse.article.body).shouldEqual(
      articleRequest.article.body,
    );

    const expectedTags = articleRequest.article.tagList
      .map((tag) => tag.toLowerCase())
      .sort();

    const actualTags = newArticleResponse.article.tagList
      .map((tag: string) => tag.toLowerCase())
      .sort();

    expect(actualTags).shouldEqual(expectedTags);

    // Update the created article
    const updatedArticleData = updateArticleData();

    const updatedArticleResponse = await api
      .path(`/articles/${articleSlug}`)
      .body(updatedArticleData)
      .putRequest(200);

    const updatedArticleSlug = updatedArticleResponse.article.slug;

    expect(updatedArticleResponse.article.title).shouldEqual(
      updatedArticleData.article.title,
    );
    expect(updatedArticleResponse.article.description).shouldEqual(
      updatedArticleData.article.description,
    );
    expect(updatedArticleResponse.article.body).shouldEqual(
      updatedArticleData.article.body,
    );

    const expectedUpdatedTags = updatedArticleData.article.tagList
      .map((tag) => tag.toLowerCase())
      .sort();

    const actualUpdatedTags = updatedArticleResponse.article.tagList
      .map((tag: string) => tag.toLowerCase())
      .sort();

    expect(actualUpdatedTags).shouldEqual(expectedUpdatedTags);

    // Delete the updated article
    await api.path(`/articles/${updatedArticleSlug}`).deleteRequest(204);
  });
});
