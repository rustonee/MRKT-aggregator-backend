const apiDocumentation = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "MRKT API",
    description: "API for MRKT marketplace",
  },
  servers: [
    {
      url: "http://localhost:8000/",
      description: "Local server",
    },
    {
      url: "http://18.222.26.84",
      description: "Testing server",
    },
    {
      url: "http://18.222.26.84",
      description: "Production server",
    },
  ],
  paths: {
    "/api/collections": {
      get: {
        tags: ["Collections operations"],
        description: "Get collections",
        responses: {
          200: {
            description: "Collections were obtained",
            content: {
              "application/json": {
                schema: {
                  //   $ref: "#/components/schemas/Collections",
                  type: "object",
                  properties: {
                    total: {
                      type: "integer",
                      example: 1,
                    },
                    collections: {
                      type: "array",
                      example: [
                        {
                          contract_address:
                            "sei15w6sty6cjjraxanrxxx0y09adwjtywhkcmydh7np25zezg9m5mwsfduktd",
                          chain_id: "pacific-1",
                          creator:
                            "sei1hjsqrfdg2hvwl3gacg4fkznurf36usrv7rkzkyh29wz3guuzeh0snslz7d",
                          name: "SEI Subjects",
                          symbol: "SEISUBJ",
                          description:
                            "The subjects of our experiments have come alive.",
                          pfp: "",
                          banner: "",
                          socials: [
                            {
                              twitter: "https://twitter.com/SeiSubjects",
                            },
                            {
                              discord: "https://discord.gg/mhBv7ZMvGE",
                            },
                          ],
                          send_listing_notification: false,
                          calculate_rarities: false,
                          start_after: "",
                          supply: 3333,
                          version: "2024-01-17T21:25:45.083Z",
                          _count: {
                            tokens: 3333,
                            auctions: 402,
                            activities: 4928,
                          },
                          owners: 987,
                          floor: [
                            {
                              denom: "usei",
                              amount: "7000000",
                            },
                          ],
                          volume: {
                            denom: "usei",
                            amount: "18660655889",
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/collections/:address": {
      get: {
        tags: ["Collections operations"],
        description: "Get collection",
        parameters: [
          {
            name: "address",
            in: "path",
            required: true,
            description: "Collection address",
            schema: {
              type: "string",
              example:
                "sei15w6sty6cjjraxanrxxx0y09adwjtywhkcmydh7np25zezg9m5mwsfduktd",
            },
          },
        ],
        responses: {
          200: {
            description: "Collection were obtained",
            content: {
              "application/json": {
                schema: {
                  //   $ref: "#/components/schemas/Collections",
                  type: "object",
                  properties: {
                    collection: {
                      type: "array",
                      example: {
                        contract_address:
                          "sei15w6sty6cjjraxanrxxx0y09adwjtywhkcmydh7np25zezg9m5mwsfduktd",
                        chain_id: "pacific-1",
                        creator:
                          "sei1hjsqrfdg2hvwl3gacg4fkznurf36usrv7rkzkyh29wz3guuzeh0snslz7d",
                        name: "SEI Subjects",
                        symbol: "SEISUBJ",
                        description:
                          "The subjects of our experiments have come alive.",
                        pfp: "",
                        banner: "",
                        socials: [
                          {
                            twitter: "https://twitter.com/SeiSubjects",
                          },
                          {
                            discord: "https://discord.gg/mhBv7ZMvGE",
                          },
                        ],
                        send_listing_notification: false,
                        calculate_rarities: false,
                        start_after: "",
                        supply: 3333,
                        version: "2024-01-17T21:25:45.083Z",
                        _count: {
                          tokens: 3333,
                          auctions: 402,
                          activities: 4928,
                        },
                        owners: 987,
                        floor: [
                          {
                            denom: "usei",
                            amount: "7000000",
                          },
                        ],
                        volume: {
                          denom: "usei",
                          amount: "18660655889",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/nfts/:address": {
      get: {
        tags: ["Nfts operations"],
        description: "Get nfts of collection",
        parameters: [
          {
            name: "address",
            in: "path",
            required: true,
            description: "Collection address",
            schema: {
              type: "string",
              example:
                "sei15w6sty6cjjraxanrxxx0y09adwjtywhkcmydh7np25zezg9m5mwsfduktd",
            },
          },
          {
            name: "page",
            in: "header",
            required: true,
            description: "Page index",
            schema: {
              type: "integer",
              example: "1",
            },
          },
          {
            name: "page_size",
            in: "header",
            required: true,
            description: "Counts per page",
            schema: {
              type: "integer",
              example: "25",
            },
          },
        ],
        responses: {
          200: {
            description: "Nfts were obtained",
            content: {
              "application/json": {
                schema: {
                  //   $ref: "#/components/schemas/Nfts",
                  type: "object",
                  properties: {
                    count: {
                      type: "integer",
                      example: 1,
                    },
                    nfts: {
                      type: "array",
                      example: [
                        {
                          key: "sei1g2a0q3tddzs7vf7lk45c2tgufsaqerxmsdr2cprth3mjtuqxm60qdmravc-1331",
                          id: "1331",
                          id_int: 1331,
                          name: "Seiyans1331",
                          owner: "sei148aumfq3axpltjuw7cnntt2m96f3l7t6pp4lyc",
                          image:
                            "https://arweave.net/ysJapp8WOOG4trLdSuIWAIHWSZ9iPVpDX26yVO9HovY/1331.png",
                          last_sale: {
                            denom: "usei",
                            amount: "415000000",
                          },
                          version: "2024-01-17T18:00:00.000Z",
                          collection_key:
                            "sei1g2a0q3tddzs7vf7lk45c2tgufsaqerxmsdr2cprth3mjtuqxm60qdmravc",
                          collection: {
                            symbol: "SYAN",
                          },
                          rarity: {
                            rank: 7007,
                            score: 72.03905032964447,
                          },
                          traits: [
                            {
                              type: "Plain backgrounds",
                              display_type: null,
                              value: "7",
                              rarity: {
                                rank: 85,
                                score: 7.861135371179039,
                                num_tokens: 1145,
                              },
                              version: "2024-01-17T18:00:00.000Z",
                            },
                          ],
                          auction: {
                            type: "fixed_price",
                            price: [
                              {
                                denom: "usei",
                                amount: "710000000",
                              },
                            ],
                            price_float: 710,
                            expiration: "2024-02-23T08:23:36.000Z",
                          },
                          bids: [],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/nfts/:address/:token_id": {
      get: {
        tags: ["Nfts operations"],
        description: "Get nft",
        parameters: [
          {
            name: "address",
            in: "path",
            required: true,
            description: "contract address",
            schema: {
              type: "string",
              example:
                "sei15w6sty6cjjraxanrxxx0y09adwjtywhkcmydh7np25zezg9m5mwsfduktd",
            },
          },
          {
            name: "token_id",
            in: "path",
            required: true,
            description: "Nft token id",
            schema: {
              type: "integer",
              example: "1331",
            },
          },
        ],
        responses: {
          200: {
            description: "Nft were obtained",
            content: {
              "application/json": {
                schema: {
                  //   $ref: "#/components/schemas/Nft",
                  type: "object",
                  properties: {
                    nft: {
                      type: "array",
                      example: {
                        key: "sei1g2a0q3tddzs7vf7lk45c2tgufsaqerxmsdr2cprth3mjtuqxm60qdmravc-1331",
                        id: "1331",
                        id_int: 1331,
                        name: "Seiyans1331",
                        owner: "sei148aumfq3axpltjuw7cnntt2m96f3l7t6pp4lyc",
                        image:
                          "https://arweave.net/ysJapp8WOOG4trLdSuIWAIHWSZ9iPVpDX26yVO9HovY/1331.png",
                        last_sale: {
                          denom: "usei",
                          amount: "415000000",
                        },
                        version: "2024-01-17T18:00:00.000Z",
                        collection_key:
                          "sei1g2a0q3tddzs7vf7lk45c2tgufsaqerxmsdr2cprth3mjtuqxm60qdmravc",
                        collection: {
                          symbol: "SYAN",
                        },
                        rarity: {
                          rank: 7007,
                          score: 72.03905032964447,
                        },
                        traits: [
                          {
                            type: "Plain backgrounds",
                            display_type: null,
                            value: "7",
                            rarity: {
                              rank: 85,
                              score: 7.861135371179039,
                              num_tokens: 1145,
                            },
                            version: "2024-01-17T18:00:00.000Z",
                          },
                        ],
                        auction: {
                          type: "fixed_price",
                          price: [
                            {
                              denom: "usei",
                              amount: "710000000",
                            },
                          ],
                          price_float: 710,
                          expiration: "2024-02-23T08:23:36.000Z",
                        },
                        bids: [],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = apiDocumentation;
