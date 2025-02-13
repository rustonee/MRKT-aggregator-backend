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
      url: "https://api.test.mrkt.exchange",
      description: "Testing server",
    },
    // {
    //   url: "https://api.test.mrkt.exchange",
    //   description: "Production server",
    // },
  ],
  paths: {
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth operations"],
        description: "User authentication",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    example: "admin",
                  },
                  password: {
                    type: "string",
                    example: "admin",
                  },
                },
              },
            },
          },
          required: true,
          description: "User authentication",
        },
        responses: {
          200: {
            description: "User logged in",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Invalid user",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/user/{address}/collections": {
      get: {
        tags: ["User operations"],
        description: "Get user's collections from pallet api",
        parameters: [
          {
            name: "address",
            in: "path",
            required: true,
            description: "user wallet address",
            schema: {
              type: "string",
              example: "sei14dmlustzjl6n07jgs86em296htggd49mcgy0pg",
            },
          },
        ],
        responses: {
          200: {
            description: "User collections were obtained",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: {
                      type: "number",
                      example: "3",
                    },
                    collections: {
                      type: "array",
                      example: [
                        {
                          contract_address:
                            "sei15w6sty6cjjraxanrxxx0y09adwjtywhkcmydh7np25zezg9m5mwsfduktd",
                          auction_count: 378,
                          floor: 0.33,
                          floor_24hr: 1.19,
                          name: "SEI Subjects",
                          owners: 874,
                          pfp: "https://static-assets.pallet.exchange/pfp/seisubjects.png",
                          slug: "sei-subjects",
                          supply: 3333,
                          volume: 25238.60368899993,
                          royalty: 10,
                          num_sales: 2767,
                          saleCount: 2767,
                          _24hFloorChange: 0,
                          _24hVolumeChange: 0,
                          listed: 11.341134113411341,
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
    "/api/v1/user/{address}/nfts": {
      get: {
        tags: ["User operations"],
        description: "Get user's nfts from pallet api",
        parameters: [
          {
            name: "address",
            in: "path",
            required: true,
            description: "user wallet address",
            schema: {
              type: "string",
              example: "sei1g72905gcxyxtg5p2fhen9h0hcn59etagrl0fuy",
            },
          },
        ],
        responses: {
          200: {
            description: "User nfts were obtained",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    address: {
                      type: "string",
                      example: "sei14dmlustzjl6n07jgs86em296htggd49mcgy0pg",
                    },
                    nfts: {
                      type: "array",
                      example: [
                        {
                          collection: {
                            contract_address:
                              "sei15w6sty6cjjraxanrxxx0y09adwjtywhkcmydh7np25zezg9m5mwsfduktd",
                            symbol: "SEISUBJ",
                          },
                          id: "73",
                          name: "Test Tube #73  ",
                          image:
                            "https://arweave.net/_nM-ZSMc2lhU0ogWZ-ldOjjJANKNzEiPoxAcViexSSc/BlueCrush.gif",
                          bids: [],
                          last_sale: {
                            denom: "usei",
                            amount: "550000",
                          },
                          auction: null,
                          rarity: {
                            score: 3.921176470588235,
                            rank: 4,
                          },
                        },
                      ],
                    },
                    bids: {
                      type: "array",
                      example: [],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/user/{address}/activities": {
      get: {
        tags: ["User operations"],
        description: "Get user's activities from pallet api",
        parameters: [
          {
            name: "address",
            in: "path",
            required: true,
            description: "User wallet address",
            schema: {
              type: "string",
              example: "sei14dmlustzjl6n07jgs86em296htggd49mcgy0pg",
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Page index",
            schema: {
              type: "integer",
              example: "1",
            },
          },
          {
            name: "page_size",
            in: "query",
            required: false,
            description: "Counts per page",
            schema: {
              type: "integer",
              example: "25",
            },
          },
          {
            name: "event",
            in: "query",
            required: false,
            description: "undefined for all activities",
            schema: {
              type: "string",
              enum: ["sale", "list", "withdraw_listing"],
              example: "sale",
            },
          },
        ],
        responses: {
          200: {
            description: "User activities were obtained",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: {
                      type: "number",
                      example: "13",
                    },
                    activities: {
                      type: "array",
                      example: [
                        {
                          id: 1132498,
                          chain_id: "pacific-1",
                          nft_address:
                            "sei1nqux82dgsyx0uv6qfhgmxvrfv2rrg3c34c3t3n4w5zqttfq7j6fq2a7zhc",
                          nft_token_id: "777",
                          event_type: "sale",
                          buyer: "sei1rd66euqzfyw2y2hg2pc5kcrvlru0cyyy6r7854",
                          seller: "sei14dmlustzjl6n07jgs86em296htggd49mcgy0pg",
                          price: [
                            {
                              denom: "usei",
                              amount: "500000",
                            },
                          ],
                          price_value: 0.5,
                          block: 58212422,
                          ts: "2024-02-16T10:07:56.000Z",
                          collection_address:
                            "sei1nqux82dgsyx0uv6qfhgmxvrfv2rrg3c34c3t3n4w5zqttfq7j6fq2a7zhc",
                          token_key:
                            "sei1nqux82dgsyx0uv6qfhgmxvrfv2rrg3c34c3t3n4w5zqttfq7j6fq2a7zhc-777",
                          collection: {
                            symbol: "NUIT",
                          },
                          token: {
                            name: "Nuit #777",
                            image:
                              "https://arweave.net/6PRRgc3IfAaeKjVQjPCqshd8h3j0oaaz8uz5auAYCog/777.png",
                            traits: [
                              {
                                type: "Background",
                                value: "Temple",
                                rarity: {
                                  num_tokens: 168,
                                  score: 33.06547619047619,
                                  rank: 2,
                                },
                              },
                            ],
                            rarity: {
                              score: 56.54817961553895,
                              rank: 317,
                            },
                          },
                          buyer_info: {
                            domain: null,
                            pfp: "https://arweave.net/jl2HLjIxJjWniiu5s-e9K-t18Keu-A-6Yuv5tqFsz8s/8947.png",
                          },
                          seller_info: {
                            domain: null,
                            pfp: "https://static-assets.pallet.exchange/pfp/user2.jpg",
                          },
                        },
                        ,
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

    "/api/v1/collections": {
      post: {
        tags: ["Pallet Collections operations"],
        description: "Add new collection",
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  address: {
                    type: "string",
                    example:
                      "sei19kfsr9zft0k9awelwwv9k87mrgwf358tfqw9tv30rlvwn8rn5kzq00hnup",
                  },
                },
              },
            },
          },
          required: true,
          description: "collection address want to add",
        },
        responses: {
          200: {
            description: "Collection were added",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "boolean",
                      example: "true",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Collection address is required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Collection address is required",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      example: "Unauthorized",
                    },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Pallet Collections operations"],
        description: "Get collections",
        parameters: [
          {
            name: "name",
            in: "query",
            required: false,
            description: "Key for searching collections",
            schema: {
              type: "string",
              example: "dob",
            },
          },
          {
            name: "sort_by_lookback",
            in: "query",
            required: false,
            description:
              'Key for sorting collections. It can be "1hr", "24hr", "7day", "30day" or "latest"(all time)',
            schema: {
              type: "string",
              example: "24hr",
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Page index",
            schema: {
              type: "integer",
              example: "1",
            },
          },
          {
            name: "page_size",
            in: "query",
            required: false,
            description: "Counts per page",
            schema: {
              type: "integer",
              example: "25",
            },
          },
        ],
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
                            "sei13zrt6ts27fd7rl3hfha7t63udghm0d904ds68h5wsvkkx5md9jqqkd7z5j",
                          name: "dob",
                          slug: "dob",
                          pfp: "https://static-assets.pallet.exchange/pfp/dob.png",
                          owners: 3112,
                          auction_count: 321,
                          supply: 5555,
                          floor: 450,
                          floor_24hr: 465,
                          num_sales: 6768,
                          num_sales_24hr: 34,
                          volume: 2364730.023189998,
                          volume_24hr: 16885,
                          saleCount: 6768,
                          _24hFloorChange: -0.03333333333333333,
                          _24hVolumeChange: 0.012573528355634245,
                          listed: 5.778577857785779,
                        },
                      ],
                    },
                    allCollectionsVolume: {
                      type: "integer",
                      example: 25453946.691740002,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/collections/{address}": {
      get: {
        tags: ["Pallet Collections operations"],
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
    "/api/v1/collections/{address}/traits": {
      get: {
        tags: ["Pallet Collections operations"],
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
                "sei14mer99s65q95hams86z6rc4yjlsdgl2axul8k9g72qs0jfxf58hq0s7u4y",
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
                    example: {
                      Background: [
                        {
                          display_type: null,
                          value: "Cosmic Blue",
                          num_tokens: 1,
                          rarity: {
                            rank: 1,
                            score: 3333,
                          },
                        },
                        {
                          display_type: null,
                          value: "Emptiness",
                          num_tokens: 1,
                          rarity: {
                            rank: 1,
                            score: 3333,
                          },
                        },
                      ],
                      Body: [
                        {
                          display_type: null,
                          value: "Astral",
                          num_tokens: 1,
                          rarity: {
                            rank: 1,
                            score: 3333,
                          },
                        },
                        {
                          display_type: null,
                          value: "Black",
                          num_tokens: 458,
                          rarity: {
                            rank: 107,
                            score: 7.277292576419214,
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
    "/api/v1/collections/{address}/activities": {
      get: {
        tags: ["Pallet Collections operations"],
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
                "sei1zjqml63xh7cfjxfe229v9c7krx05ytlz22y3cpf09wz83xck5q9qu73y03",
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Page index",
            schema: {
              type: "integer",
              example: "1",
            },
          },
          {
            name: "page_size",
            in: "query",
            required: false,
            description: "Counts per page",
            schema: {
              type: "integer",
              example: "25",
            },
          },
          {
            name: "type",
            in: "query",
            required: false,
            description: "undefined for all activities",
            schema: {
              type: "string",
              enum: ["sale", "list", "withdraw_listing"],
              example: "sale",
            },
          },
        ],
        responses: {
          200: {
            description: "List of collection activities",
          },
        },
      },
    },

    "/api/v1/nfts/{address}": {
      get: {
        tags: ["Pallet Nfts operations"],
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
                "sei14mer99s65q95hams86z6rc4yjlsdgl2axul8k9g72qs0jfxf58hq0s7u4y",
            },
          },
          {
            name: "buy_now_only",
            in: "query",
            required: true,
            description: "If true, get purchasable nfts, else get all nfts",
            schema: {
              type: "boolean",
              example: "true",
            },
          },
          {
            name: "token_id",
            in: "query",
            required: false,
            description: "token Id for searching nfts",
            schema: {
              type: "integer",
              example: "10",
            },
          },
          {
            name: "sort_by_price",
            in: "query",
            required: false,
            description: "If 'asc' show Low to High, else High to Low",
            schema: {
              type: "string",
              example: "asc",
            },
          },
          {
            name: "page",
            in: "query",
            required: true,
            description: "Page index",
            schema: {
              type: "integer",
              example: "1",
            },
          },
          {
            name: "page_size",
            in: "query",
            required: true,
            description: "Counts per page",
            schema: {
              type: "integer",
              example: "25",
            },
          },
          {
            name: "traits",
            in: "query",
            required: false,
            description: "traits",
            schema: {
              type: "string",
              example: `{"Background":["Cosmic Blue"],"Body":["Astral"]} `,
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
    "/api/v1/nfts/{address}/{token_id}": {
      get: {
        tags: ["Pallet Nfts operations"],
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
    "/api/v1/nfts/{address}/{token_id}/activities": {
      get: {
        tags: ["Pallet Nfts operations"],
        description: "Get nft activities",
        parameters: [
          {
            name: "address",
            in: "path",
            required: true,
            description: "contract address",
            schema: {
              type: "string",
              example:
                "sei1atcfjjz779ynmlek4tqh47ssrwge0mhlauyr637wdjkrhtfqdjqqtlcwhl",
            },
          },
          {
            name: "token_id",
            in: "path",
            required: true,
            description: "Nft token id",
            schema: {
              type: "integer",
              example: "2700",
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Page index",
            schema: {
              type: "integer",
              example: "1",
            },
          },
          {
            name: "page_size",
            in: "query",
            required: false,
            description: "Counts per page",
            schema: {
              type: "integer",
              example: "25",
            },
          },
          {
            name: "event",
            in: "query",
            required: false,
            description: "activity event",
            schema: {
              type: "string",
              enum: ["sold", "listed"],
              example: "sale",
            },
          },
        ],
        responses: {
          200: {
            description: "Nft activities list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: {
                      type: "integer",
                      example: 1,
                    },
                    activities: {
                      type: "array",
                      example: {
                        id: 471070,
                        chain_id: "pacific-1",
                        nft_address:
                          "sei1atcfjjz779ynmlek4tqh47ssrwge0mhlauyr637wdjkrhtfqdjqqtlcwhl",
                        nft_token_id: "2700",
                        event_type: "sale",
                        buyer: "sei12n8drufuy06vt6g0h8k8frkpfyhm20sznggk4l",
                        seller: "sei1gru8sflxcspf54f4xjzd37hg0v5g6m6mhxdy7c",
                        price: [
                          {
                            denom: "usei",
                            amount: "50000000",
                          },
                        ],
                        price_value: 50,
                        block: 52935013,
                        ts: "2024-01-20T19:29:28.000Z",
                        collection_address:
                          "sei1atcfjjz779ynmlek4tqh47ssrwge0mhlauyr637wdjkrhtfqdjqqtlcwhl",
                        token_key:
                          "sei1atcfjjz779ynmlek4tqh47ssrwge0mhlauyr637wdjkrhtfqdjqqtlcwhl-2700",
                        collection: {
                          symbol: "SEIMU",
                        },
                        token: {
                          name: "Seimurai #2700",
                          image:
                            "https://arweave.net/oTXpkbFE--Izx7ZPCXIXQ1ypu02x_ZKrTnOAJDfo7Y0/2700.png",
                          traits: [
                            {
                              type: "Background",
                              value: "Pastel",
                              rarity: {
                                num_tokens: 380,
                                score: 8.771052631578947,
                                rank: 95,
                              },
                            },
                            {
                              type: "Power",
                              value: "Water",
                              rarity: {
                                num_tokens: 140,
                                score: 23.80714285714286,
                                rank: 44,
                              },
                            },
                            {
                              type: "Weapon",
                              value: "Mokuton",
                              rarity: {
                                num_tokens: 124,
                                score: 26.87903225806452,
                                rank: 40,
                              },
                            },
                            {
                              type: "Body",
                              value: "Hiro",
                              rarity: {
                                num_tokens: 455,
                                score: 7.325274725274725,
                                rank: 100,
                              },
                            },
                            {
                              type: "Clothes",
                              value: "Cyber Punk",
                              rarity: {
                                num_tokens: 102,
                                score: 32.6764705882353,
                                rank: 30,
                              },
                            },
                            {
                              type: "Face",
                              value: "Red Make",
                              rarity: {
                                num_tokens: 110,
                                score: 30.3,
                                rank: 34,
                              },
                            },
                            {
                              type: "Hair",
                              value: "White Cute",
                              rarity: {
                                num_tokens: 151,
                                score: 22.0728476821192,
                                rank: 50,
                              },
                            },
                            {
                              type: "Background",
                              value: "Pastel",
                              rarity: {
                                num_tokens: 380,
                                score: 8.771052631578947,
                                rank: 95,
                              },
                            },
                            {
                              type: "Power",
                              value: "Water",
                              rarity: {
                                num_tokens: 140,
                                score: 23.80714285714286,
                                rank: 44,
                              },
                            },
                            {
                              type: "Weapon",
                              value: "Mokuton",
                              rarity: {
                                num_tokens: 124,
                                score: 26.87903225806452,
                                rank: 40,
                              },
                            },
                            {
                              type: "Body",
                              value: "Hiro",
                              rarity: {
                                num_tokens: 455,
                                score: 7.325274725274725,
                                rank: 100,
                              },
                            },
                            {
                              type: "Clothes",
                              value: "Cyber Punk",
                              rarity: {
                                num_tokens: 102,
                                score: 32.6764705882353,
                                rank: 30,
                              },
                            },
                            {
                              type: "Face",
                              value: "Red Make",
                              rarity: {
                                num_tokens: 110,
                                score: 30.3,
                                rank: 34,
                              },
                            },
                            {
                              type: "Hair",
                              value: "White Cute",
                              rarity: {
                                num_tokens: 151,
                                score: 22.0728476821192,
                                rank: 50,
                              },
                            },
                            {
                              type: "Background",
                              value: "Pastel",
                              rarity: {
                                num_tokens: 380,
                                score: 8.771052631578947,
                                rank: 95,
                              },
                            },
                            {
                              type: "Power",
                              value: "Water",
                              rarity: {
                                num_tokens: 140,
                                score: 23.80714285714286,
                                rank: 44,
                              },
                            },
                            {
                              type: "Weapon",
                              value: "Mokuton",
                              rarity: {
                                num_tokens: 124,
                                score: 26.87903225806452,
                                rank: 40,
                              },
                            },
                            {
                              type: "Body",
                              value: "Hiro",
                              rarity: {
                                num_tokens: 455,
                                score: 7.325274725274725,
                                rank: 100,
                              },
                            },
                            {
                              type: "Clothes",
                              value: "Cyber Punk",
                              rarity: {
                                num_tokens: 102,
                                score: 32.6764705882353,
                                rank: 30,
                              },
                            },
                            {
                              type: "Face",
                              value: "Red Make",
                              rarity: {
                                num_tokens: 110,
                                score: 30.3,
                                rank: 34,
                              },
                            },
                            {
                              type: "Hair",
                              value: "White Cute",
                              rarity: {
                                num_tokens: 151,
                                score: 22.0728476821192,
                                rank: 50,
                              },
                            },
                          ],
                          rarity: {
                            score: 151.8318207424156,
                            rank: 535,
                          },
                        },
                        buyer_info: {
                          domain: null,
                          pfp: "https://arweave.net/ysJapp8WOOG4trLdSuIWAIHWSZ9iPVpDX26yVO9HovY/5312.png",
                        },
                        seller_info: {
                          domain: "yondu.sei",
                          pfp: "https://arweave.net/BLeWHs72ccmVxIPoJSRsW5EUG58KIzPMGRin8H0sLms/4442.png",
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
  },
};

module.exports = apiDocumentation;
