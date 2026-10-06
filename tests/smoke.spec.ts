import { expect } from "../utils/custom-expect";
import { test } from "../utils/fixtures";
import { faker } from "@faker-js/faker";
import { validateSchema } from "../utils/schema-validator";

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

    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
  });

  test("Get Test Tags", async ({ api }) => {
    const response = await api.path("/tags").getRequest(200);

    await validateSchema("tags", "GET_tags", response);

    expect(response.tags[0]).shouldEqual("Test");
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
  });

  test("Create and Delete Article", async ({ api }) => {
    // Generate random article data using faker
    const articleTitle = faker.lorem.words(3);
    const articleDescription = faker.lorem.sentence();
    const articleBody = faker.lorem.paragraph();
    const articleTags = [faker.lorem.word(), faker.lorem.word()];

    const articleData = {
      article: {
        title: articleTitle,
        description: articleDescription,
        body: articleBody,
        tagList: articleTags,
      },
    };

    // Create a new article
    const newArticleResponse = await api
      .path("/articles")
      .body(articleData)
      .postRequest(201);

    const articleSlug = newArticleResponse.article.slug;

    expect(newArticleResponse.article.title).shouldEqual(articleTitle);
    expect(newArticleResponse.article.description).shouldEqual(
      articleDescription,
    );
    expect(newArticleResponse.article.body).shouldEqual(articleBody);

    const expectedTags = articleTags.map((tag) => tag.toLowerCase()).sort();

    const actualTags = newArticleResponse.article.tagList
      .map((tag: string) => tag.toLowerCase())
      .sort();

    expect(actualTags).shouldEqual(expectedTags);

    // Delete the created article
    await api.path(`/articles/${articleSlug}`).deleteRequest(204);
  });

  test("Create, Update, and Delete Article", async ({ api }) => {
    // Generate random article data using faker
    const articleTitle = faker.lorem.words(3);
    const articleDescription = faker.lorem.sentence();
    const articleBody = faker.lorem.paragraph();
    const articleTags = [faker.lorem.word(), faker.lorem.word()];

    const articleData = {
      article: {
        title: articleTitle,
        description: articleDescription,
        body: articleBody,
        tagList: articleTags,
      },
    };

    // Create a new article
    const newArticleResponse = await api
      .path("/articles")
      .body(articleData)
      .postRequest(201);

    const articleSlug = newArticleResponse.article.slug;

    expect(newArticleResponse.article.title).shouldEqual(articleTitle);
    expect(newArticleResponse.article.description).shouldEqual(
      articleDescription,
    );
    expect(newArticleResponse.article.body).shouldEqual(articleBody);

    const expectedTags = articleTags.map((tag) => tag.toLowerCase()).sort();

    const actualTags = newArticleResponse.article.tagList
      .map((tag: string) => tag.toLowerCase())
      .sort();

    expect(actualTags).shouldEqual(expectedTags);

    // Update the created article
    const updatedArticleData = {
      article: {
        title: faker.lorem.words(4),
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        tagList: [faker.lorem.word(), faker.lorem.word()],
      },
    };

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
